/**
 * MindKatha Clinical Practice — Secure WhatsApp & SMS OTP Backend-for-Frontend (BFF)
 * Runs on Node.js v20+ using zero external npm dependencies (native http, crypto, fetch, fs).
 *
 * Supported Providers (via OTP_PROVIDER env variable):
 *  - 'msg91'         : MSG91 India WhatsApp / SMS OTP API
 *  - 'meta_whatsapp' : Official Meta WhatsApp Business Cloud API (Authentication Template)
 *  - 'twilio'        : Twilio Verify API (WhatsApp / SMS)
 *  - 'gupshup'       : Gupshup WhatsApp Template API
 *  - 'sandbox'       : Local Development Sandbox (automatically active when provider keys are not set)
 */

import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if present (zero-dependency parser)
function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const rawVal = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) {
      process.env[key] = rawVal;
    }
  }
}

loadEnvFile();

// Multi-tiered secret resolution (Env -> Ephemeral CSPRNG fallback for local sandbox)
function resolveHmacSecret() {
  if (process.env.OTP_HMAC_SECRET && process.env.OTP_HMAC_SECRET.length >= 32) {
    return process.env.OTP_HMAC_SECRET;
  }
  console.warn('[OTP-BFF] Notice: OTP_HMAC_SECRET not set in .env. Using ephemeral 32-byte CSPRNG secret for this process instance.');
  return crypto.randomBytes(32).toString('hex');
}

const HMAC_SECRET = resolveHmacSecret();
const PORT = Number(process.env.OTP_SERVER_PORT || 3001);
const HOST = '127.0.0.1'; // Strict localhost binding per security guidelines
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:4200';
const PRACTICE_WHATSAPP = process.env.PRACTICE_WHATSAPP_NUMBER || '919876543210';

// Detect active provider based on configured credentials
function getActiveProvider() {
  const explicit = (process.env.OTP_PROVIDER || '').toLowerCase().trim();
  if (explicit && explicit !== 'auto') return explicit;
  if (process.env.RESEND_API_KEY) return 'resend_email';
  if (process.env.MSG91_AUTH_KEY) return 'msg91';
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) return 'meta_whatsapp';
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SID) return 'twilio';
  if (process.env.GUPSHUP_API_KEY) return 'gupshup';
  return 'sandbox';
}

// In-memory store for OTP sessions and rate limiting
// Map<phoneE164, { otpHash: string, salt: string, expiresAt: number, attemptsLeft: number, clientName: string }>
const otpStore = new Map();
// Map<ipOrPhone, { count: number, windowStart: number }>
const rateLimitStore = new Map();

function checkRateLimit(key, maxRequests = 6, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

function normalizePhoneE164(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return digits ? `+${digits}` : '';
}

function createOtpHash(phoneE164, otp, salt, expiresAt) {
  return crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${phoneE164}:${otp}:${salt}:${expiresAt}`)
    .digest('hex');
}

function signChallengeToken(phoneE164, otpHash, salt, expiresAt) {
  const payload = `${phoneE164}|${otpHash}|${salt}|${expiresAt}`;
  const sig = crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}|${sig}`).toString('base64url');
}

function verifyChallengeToken(token, phoneE164, enteredOtp) {
  try {
    const decoded = Buffer.from(String(token || ''), 'base64url').toString('utf-8');
    const parts = decoded.split('|');
    if (parts.length !== 5) return { valid: false, reason: 'Malformed challenge token.' };
    const [tokenPhone, otpHash, salt, expiresAtStr, sig] = parts;
    const expiresAt = Number(expiresAtStr);

    if (tokenPhone !== phoneE164) {
      return { valid: false, reason: 'Phone number mismatch.' };
    }
    if (Date.now() > expiresAt) {
      return { valid: false, reason: 'Verification code has expired. Please request a new code.' };
    }

    const expectedPayload = `${tokenPhone}|${otpHash}|${salt}|${expiresAtStr}`;
    const expectedSig = crypto.createHmac('sha256', HMAC_SECRET).update(expectedPayload).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))) {
      return { valid: false, reason: 'Invalid challenge signature.' };
    }

    const candidateHash = createOtpHash(phoneE164, enteredOtp, salt, expiresAt);
    const isMatch = crypto.timingSafeEqual(Buffer.from(otpHash, 'hex'), Buffer.from(candidateHash, 'hex'));
    return { valid: isMatch, reason: isMatch ? 'Verified' : 'Incorrect 6-digit passkey.' };
  } catch {
    return { valid: false, reason: 'Invalid verification session.' };
  }
}

/**
 * Provider Dispatch Adapters
 */
async function dispatchViaProvider(provider, phoneE164, otp, clientName, clientEmail = '') {
  const digitsOnly = phoneE164.replace(/\D/g, ''); // e.g. 919876543210

  switch (provider) {
    case 'resend_email': {
      // Sends branded HTML 6-digit OTP directly from @mindkatha.com (via Resend API — 3,000 free/month)
      const fromEmail = process.env.MINDKATHA_FROM_EMAIL || 'MindKatha Clinical <verify@mindkatha.com>';
      const targetEmail = clientEmail || process.env.MINDKATHA_ADMIN_EMAIL || 'psychotherapy.leona@gmail.com';

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [targetEmail],
          subject: `${otp} is your MindKatha Clinical verification passkey`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px;">
              <p style="font-size: 12px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">MindKatha Clinical Practice</p>
              <h2 style="font-size: 22px; color: #0f172a; margin: 0 0 12px;">Your 6-Digit Verification Passkey</h2>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">Hello ${clientName}, use the passkey below to confirm your consultation slot (${phoneE164}):</p>
              <div style="margin: 24px 0; padding: 18px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; text-align: center; font-size: 28px; font-weight: 800; letter-spacing: 0.25em; color: #0f172a;">
                ${otp}
              </div>
              <p style="font-size: 12px; color: #64748b;">Valid for 10 minutes • Viman Nagar, Pune &amp; Online Telehealth • psychotherapy.leona@gmail.com</p>
            </div>
          `
        })
      });
      if (!res.ok) {
        throw new Error(`Resend (@mindkatha.com) gateway returned HTTP ${res.status}`);
      }
      return { deliveredVia: 'verify@mindkatha.com Official Email' };
    }
    case 'msg91': {
      // MSG91 v5 OTP API (Supports WhatsApp & SMS fallback)
      const url = new URL('https://control.msg91.com/api/v5/otp');
      url.searchParams.set('template_id', process.env.MSG91_TEMPLATE_ID || '');
      url.searchParams.set('mobile', digitsOnly);
      url.searchParams.set('otp', otp);

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'authkey': process.env.MSG91_AUTH_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: clientName, otp })
      });
      if (!res.ok) {
        throw new Error(`MSG91 gateway returned HTTP ${res.status}`);
      }
      return { deliveredVia: 'MSG91 WhatsApp/SMS Gateway' };
    }

    case 'meta_whatsapp': {
      // Official Meta WhatsApp Cloud API (Authentication Template)
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME || 'mindkatha_otp_verify';
      const languageCode = process.env.WHATSAPP_OTP_TEMPLATE_LANG || 'en';

      const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: digitsOnly,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: otp }]
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [{ type: 'text', text: otp }]
              }
            ]
          }
        })
      });
      if (!res.ok) {
        throw new Error(`Meta WhatsApp Cloud API returned HTTP ${res.status}`);
      }
      return { deliveredVia: 'Meta WhatsApp Business Cloud API' };
    }

    case 'twilio': {
      // Twilio Verify API (WhatsApp or SMS channel)
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const verifySid = process.env.TWILIO_VERIFY_SID;
      const channel = process.env.TWILIO_CHANNEL || 'whatsapp'; // 'whatsapp' or 'sms'

      const params = new URLSearchParams();
      params.append('To', phoneE164);
      params.append('Channel', channel);

      const authHeader = Buffer.from(`${sid}:${token}`).toString('base64');
      const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/Verifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      if (!res.ok) {
        throw new Error(`Twilio Verify returned HTTP ${res.status}`);
      }
      return { deliveredVia: `Twilio Verify (${channel.toUpperCase()})` };
    }

    case 'gupshup': {
      const params = new URLSearchParams();
      params.append('channel', 'whatsapp');
      params.append('source', process.env.GUPSHUP_SOURCE_NUMBER || PRACTICE_WHATSAPP);
      params.append('destination', digitsOnly);
      params.append('src.name', process.env.GUPSHUP_APP_NAME || 'MindKatha');
      params.append(
        'template',
        JSON.stringify({
          id: process.env.GUPSHUP_TEMPLATE_ID,
          params: [clientName, otp]
        })
      );

      const res = await fetch('https://api.gupshup.io/wa/api/v1/template/msg', {
        method: 'POST',
        headers: {
          'apikey': process.env.GUPSHUP_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      if (!res.ok) {
        throw new Error(`Gupshup API returned HTTP ${res.status}`);
      }
      return { deliveredVia: 'Gupshup WhatsApp Enterprise' };
    }

    default:
      return { deliveredVia: 'Local BFF Sandbox (Click-to-WhatsApp + Instant Passkey)' };
  }
}

async function verifyViaTwilio(phoneE164, enteredOtp) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SID;

  const params = new URLSearchParams();
  params.append('To', phoneE164);
  params.append('Code', enteredOtp);

  const authHeader = Buffer.from(`${sid}:${token}`).toString('base64');
  const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/VerificationCheck`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.status === 'approved';
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 16 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  const url = new URL(req.url || '/', `http://${HOST}:${PORT}`);
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  // 1. Health & Provider Status Check
  if (req.method === 'GET' && url.pathname === '/api/otp/status') {
    const provider = getActiveProvider();
    return sendJson(res, 200, {
      ok: true,
      provider,
      isLiveGateway: provider !== 'sandbox',
      practiceWhatsApp: PRACTICE_WHATSAPP
    });
  }

  // 2. Send 6-Digit OTP
  if (req.method === 'POST' && url.pathname === '/api/otp/send') {
    try {
      const body = await parseJsonBody(req);
      const phoneE164 = normalizePhoneE164(body.phoneNumber);
      const clientName = String(body.clientName || 'Client').replace(/[<>]/g, '').trim().slice(0, 80) || 'Client';

      if (!/^\+\d{10,15}$/.test(phoneE164)) {
        return sendJson(res, 400, {
          success: false,
          message: 'Please enter a valid 10-digit WhatsApp number.'
        });
      }

      if (!checkRateLimit(`ip:${clientIp}`, 12) || !checkRateLimit(`phone:${phoneE164}`, 5)) {
        return sendJson(res, 429, {
          success: false,
          message: 'Too many passkey requests. Please wait a few minutes before retrying.'
        });
      }

      const otp = String(crypto.randomInt(100000, 1000000));
      const salt = crypto.randomBytes(16).toString('hex');
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      const otpHash = createOtpHash(phoneE164, otp, salt, expiresAt);
      const challengeToken = signChallengeToken(phoneE164, otpHash, salt, expiresAt);

      otpStore.set(phoneE164, {
        otpHash,
        salt,
        expiresAt,
        attemptsLeft: 3,
        clientName
      });

      const provider = getActiveProvider();
      const dispatchInfo = await dispatchViaProvider(provider, phoneE164, otp, clientName);

      const messageText = encodeURIComponent(
        `MindKatha Clinical Practice: Verification OTP for ${clientName} (${phoneE164}) is ${otp}. Enter this 6-digit code on the appointment screen to confirm your session.`
      );
      const whatsappUrl = `https://wa.me/${PRACTICE_WHATSAPP}?text=${messageText}`;

      return sendJson(res, 200, {
        success: true,
        provider,
        isLiveGateway: provider !== 'sandbox',
        deliveredVia: dispatchInfo.deliveredVia,
        message:
          provider === 'sandbox'
            ? `Passkey generated for ${phoneE164} (Sandbox Mode)`
            : `6-digit passkey dispatched to ${phoneE164} via ${dispatchInfo.deliveredVia}`,
        challengeToken,
        whatsappUrl,
        // Only expose simulatedOtp when running in sandbox mode; never expose in live gateway mode
        simulatedOtp: provider === 'sandbox' ? otp : undefined
      });
    } catch (err) {
      return sendJson(res, 500, {
        success: false,
        message: 'Unable to dispatch verification passkey right now. Please try again.'
      });
    }
  }

  // 3. Verify 6-Digit OTP
  if (req.method === 'POST' && url.pathname === '/api/otp/verify') {
    try {
      const body = await parseJsonBody(req);
      const phoneE164 = normalizePhoneE164(body.phoneNumber);
      const enteredOtp = String(body.otp || '').replace(/\D/g, '').trim();
      const challengeToken = String(body.challengeToken || '');

      if (enteredOtp.length !== 6) {
        return sendJson(res, 400, {
          success: false,
          message: 'Please enter all 6 digits of your verification passkey.'
        });
      }

      const provider = getActiveProvider();
      if (provider === 'twilio') {
        const approved = await verifyViaTwilio(phoneE164, enteredOtp);
        if (approved) {
          otpStore.delete(phoneE164);
          return sendJson(res, 200, {
            success: true,
            message: 'WhatsApp number verified successfully.'
          });
        }
        return sendJson(res, 400, {
          success: false,
          message: 'Incorrect or expired verification code.'
        });
      }

      // Check in-memory session attempts if present
      const session = otpStore.get(phoneE164);
      if (session) {
        if (Date.now() > session.expiresAt) {
          otpStore.delete(phoneE164);
          return sendJson(res, 400, {
            success: false,
            message: 'Verification code has expired. Please tap Resend Code.'
          });
        }
        if (session.attemptsLeft <= 0) {
          otpStore.delete(phoneE164);
          return sendJson(res, 429, {
            success: false,
            message: 'Too many incorrect attempts. Please request a new passkey.'
          });
        }
      }

      // Verify cryptographic HMAC challenge token
      const check = verifyChallengeToken(challengeToken, phoneE164, enteredOtp);
      if (check.valid) {
        otpStore.delete(phoneE164);
        const verifiedBookingToken = signChallengeToken(
          phoneE164,
          'VERIFIED',
          crypto.randomBytes(8).toString('hex'),
          Date.now() + 30 * 60 * 1000
        );
        return sendJson(res, 200, {
          success: true,
          message: 'WhatsApp number verified successfully.',
          verifiedBookingToken
        });
      }

      if (session) {
        session.attemptsLeft -= 1;
        return sendJson(res, 400, {
          success: false,
          message: `Incorrect code. ${session.attemptsLeft} attempt(s) remaining.`
        });
      }

      return sendJson(res, 400, {
        success: false,
        message: check.reason || 'Incorrect verification code.'
      });
    } catch {
      return sendJson(res, 500, {
        success: false,
        message: 'Verification error occurred. Please try again.'
      });
    }
  }

  // 4. Confirm Clinical Booking & Generate WhatsApp Dispatch Link
  if (req.method === 'POST' && url.pathname === '/api/otp/confirm-booking') {
    try {
      const body = await parseJsonBody(req);
      const phoneE164 = normalizePhoneE164(body.phoneNumber);
      const clientName = String(body.clientName || 'Client').replace(/[<>]/g, '').trim().slice(0, 80);
      const service = String(body.service || 'Clinical Consultation').replace(/[<>]/g, '').trim().slice(0, 140);
      const date = String(body.date || '').replace(/[<>]/g, '').trim().slice(0, 30);
      const slot = String(body.slot || '').replace(/[<>]/g, '').trim().slice(0, 40);
      const mode = body.mode === 'studio' ? 'In-Person Studio (Viman Nagar, Pune)' : 'Encrypted Online Video';

      const bookingReference = `MK-${crypto.randomInt(100000, 999999)}`;
      const confirmationText = encodeURIComponent(
        `Hi Leona (MindKatha), my booking is confirmed!\n\n` +
        `• Reference: ${bookingReference}\n` +
        `• Patient: ${clientName} (${phoneE164})\n` +
        `• Pathway: ${service}\n` +
        `• Format: ${mode}\n` +
        `• Date & Slot: ${date} | ${slot} IST`
      );
      const whatsappConfirmationUrl = `https://wa.me/${PRACTICE_WHATSAPP}?text=${confirmationText}`;

      return sendJson(res, 200, {
        success: true,
        bookingReference,
        whatsappConfirmationUrl
      });
    } catch {
      return sendJson(res, 500, {
        success: false,
        message: 'Could not finalize booking reference.'
      });
    }
  }

  return sendJson(res, 404, { error: 'Endpoint not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[MindKatha OTP BFF] Listening securely on http://${HOST}:${PORT} (Provider: ${getActiveProvider()})`);
});
