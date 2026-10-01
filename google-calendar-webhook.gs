/**
 * ============================================================================
 * MINDKATHA — THERAPIST-APPROVED GOOGLE CALENDAR BOOKING WEBHOOK
 * Account: psychotherapy.leona@gmail.com (100% Free, Zero Credit Card Needed)
 * ============================================================================
 *
 * HOW THE 2-STEP APPROVAL FLOW WORKS:
 * 1. Patient submits a slot request on the website (`action=requestBooking` or `createBooking`).
 *    - Neither Leona's calendar nor the patient's calendar is booked yet.
 *    - Leona receives an email with 1-click [Confirm & Book Calendar Slot] and
 *      [Decline / Propose New Time] buttons.
 *    - Patient receives a "Request Received — Pending Leona's Confirmation" email.
 * 2. When Leona clicks [Confirm & Book Calendar Slot] (`action=approveBooking`):
 *    - Leona's Google Calendar is officially blocked for that slot.
 *    - Google Calendar invite + confirmation email are sent to the patient.
 *    - Leona sees a confirmation page with a 1-click WhatsApp message button.
 * 3. When Leona clicks [Decline / Propose New Time] (`action=declineBooking`):
 *    - Calendar slot remains open.
 *    - Patient is notified by email that Leona will reach out to coordinate another time.
 *
 * IMPORTANT DEPLOYMENT SETTING (Fixes 403 Forbidden):
 * 1. In https://script.google.com, click "Deploy" -> "Manage deployments"
 * 2. Click the Pencil icon (Edit) -> Version: "New version"
 * 3. Set "Execute as": "Me (psychotherapy.leona@gmail.com)"
 * 4. Set "Who has access": "Anyone"  <-- MUST BE "Anyone" (NOT "Only myself")
 * 5. Click "Deploy"
 */

const PRACTICE_EMAIL = 'psychotherapy.leona@gmail.com';
const TIMEZONE = 'Asia/Kolkata';

// Map of website slot labels to 24-hour IST start times
const SLOT_START_HOURS = {
  '03:00 PM': 15,
  '04:00 PM': 16,
  '05:00 PM': 17,
  '07:00 PM': 19,
  '08:00 PM': 20,
  '09:00 PM': 21
};

/**
 * GET Handler:
 * Supports:
 * 1. `?action=getBusySlots&start=YYYY-MM-DD&end=YYYY-MM-DD`
 * 2. `?action=requestBooking&...` (or legacy `action=createBooking`) -> Sends approval request to Leona
 * 3. `?action=approveBooking&...` -> Triggered when Leona clicks "Confirm & Book" in her email
 * 4. `?action=declineBooking&...` -> Triggered when Leona clicks "Decline / Reschedule" in her email
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};

    if (params.action === 'requestBooking' || params.action === 'createBooking') {
      return handleRequestBooking(params);
    }

    if (params.action === 'approveBooking') {
      return handleApproveBooking(params);
    }

    if (params.action === 'declineBooking') {
      return handleDeclineBooking(params);
    }

    const startParam = params.start;
    const endParam = params.end;

    const startDate = startParam ? new Date(startParam + 'T00:00:00+05:30') : new Date();
    const endDate = endParam
      ? new Date(endParam + 'T23:59:59+05:30')
      : new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const calendar = CalendarApp.getDefaultCalendar();
    const events = calendar.getEvents(startDate, endDate);
    const busySlots = {};

    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const dateStr = Utilities.formatDate(cursor, TIMEZONE, 'yyyy-MM-dd');

      Object.keys(SLOT_START_HOURS).forEach(function (slotLabel) {
        const hour = SLOT_START_HOURS[slotLabel];
        const slotStart = new Date(dateStr + 'T' + String(hour).padStart(2, '0') + ':00:00+05:30');
        const slotEnd = new Date(slotStart.getTime() + 50 * 60 * 1000);

        const hasConflict = events.some(function (ev) {
          if (ev.isAllDayEvent()) return false;
          return ev.getStartTime() < slotEnd && ev.getEndTime() > slotStart;
        });

        if (hasConflict) {
          if (!busySlots[dateStr]) busySlots[dateStr] = [];
          busySlots[dateStr].push(slotLabel);
        }
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return jsonResponse({ status: 'ok', busySlots: busySlots });
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) });
  }
}

/**
 * POST Handler:
 * Delegates to handleRequestBooking(data)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return handleRequestBooking(data);
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) });
  }
}

/**
 * Escapes user-supplied strings before interpolating into HTML email templates or HtmlService pages.
 */
function escapeHtml(raw) {
  return String(raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Normalizes a phone number for wa.me links (ensures 91 country code for 10-digit Indian numbers).
 */
function formatWhatsAppPhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

/**
 * Builds a 1-tap https://wa.me/<phone>?text=<encoded_message> URL pre-filled with the client's booking data.
 * @param {Object} data - Booking parameters
 * @param {'confirm' | 'reschedule' | 'inquiry'} type - Message template type
 */
function buildPrefilledWhatsAppUrl(data, type) {
  const waPhone = formatWhatsAppPhone(data.phoneNumber);
  const isStudio = String(data.mode || '').toLowerCase().indexOf('studio') !== -1;
  const locationLine = isStudio
    ? '• *Studio Address:* 001, Ground Floor, Disha Eternia, Sakore Nagar, Viman Nagar, Pune 411014'
    : '• *Session Link:* Encrypted video link will be shared prior to the session';

  let lines = [];

  if (type === 'confirm') {
    lines = [
      'Hi ' + data.clientName + ', this is Leona Lahkar from *MindKatha*.',
      '',
      'Your session request is *confirmed*:',
      '• *Date & Time:* ' + data.dayLabel + ' at ' + data.slot + ' IST',
      '• *Care Pathway:* ' + data.service,
      '• *Format:* ' + data.mode,
      locationLine,
      '',
      'This slot is now reserved on our calendar. Looking forward to speaking with you!'
    ];
  } else if (type === 'reschedule') {
    lines = [
      'Hi ' + data.clientName + ', this is Leona Lahkar from *MindKatha*.',
      '',
      'Thank you for requesting a session:',
      '• *Requested Slot:* ' + data.dayLabel + ' at ' + data.slot + ' IST',
      '• *Care Pathway:* ' + data.service,
      '• *Format:* ' + data.mode,
      '',
      'Unfortunately, that specific time slot is unavailable on my schedule. Could we look at an alternative time that works comfortably for you?'
    ];
  } else {
    lines = [
      'Hi ' + data.clientName + ', this is Leona Lahkar from *MindKatha* regarding your session request:',
      '',
      '• *Requested Slot:* ' + data.dayLabel + ' at ' + data.slot + ' IST',
      '• *Care Pathway:* ' + data.service,
      '• *Format:* ' + data.mode
    ];
  }

  return 'https://wa.me/' + waPhone + '?text=' + encodeURIComponent(lines.join('\n'));
}

/**
 * STAGE 1: Patient submits a booking request.
 * Does NOT book the calendar yet. Sends Leona an approval email with 1-click Confirm / Decline buttons
 * AND 1-tap pre-filled wa.me WhatsApp links to message the customer directly.
 */
function handleRequestBooking(data) {
  const baseUrl = data.webhookUrl || ScriptApp.getService().getUrl();
  const queryParts = [
    'clientName=' + encodeURIComponent(data.clientName || ''),
    'phoneNumber=' + encodeURIComponent(data.phoneNumber || ''),
    'clientEmail=' + encodeURIComponent(data.clientEmail || ''),
    'service=' + encodeURIComponent(data.service || ''),
    'durationMinutes=' + encodeURIComponent(data.durationMinutes || '50'),
    'mode=' + encodeURIComponent(data.mode || ''),
    'date=' + encodeURIComponent(data.date || ''),
    'dayLabel=' + encodeURIComponent(data.dayLabel || ''),
    'slot=' + encodeURIComponent(data.slot || '')
  ].join('&');

  const approveUrl = baseUrl + '?action=approveBooking&' + queryParts;
  const declineUrl = baseUrl + '?action=declineBooking&' + queryParts;

  // Pre-filled 1-tap wa.me links for Leona -> Customer
  const waConfirmLink = buildPrefilledWhatsAppUrl(data, 'confirm');
  const waRescheduleLink = buildPrefilledWhatsAppUrl(data, 'reschedule');
  const waInquiryLink = buildPrefilledWhatsAppUrl(data, 'inquiry');

  const safeName = escapeHtml(data.clientName);
  const safePhone = escapeHtml(data.phoneNumber);
  const safeEmail = escapeHtml(data.clientEmail || '—');
  const safeDayLabel = escapeHtml(data.dayLabel);
  const safeSlot = escapeHtml(data.slot);
  const safeMode = escapeHtml(data.mode);
  const safeService = escapeHtml(data.service);

  // 1. Send Approval Request Email to Leona
  const emailSubject = '[Action Required] Approve Session Request: ' + data.clientName + ' — ' + data.dayLabel + ' at ' + data.slot + ' IST';
  const emailHtml = [
    '<div style="font-family: Arial, sans-serif; max-width: 580px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; color: #0f172a;">',
    '  <div style="display: inline-block; padding: 4px 12px; border-radius: 999px; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;">Awaiting Your Confirmation</div>',
    '  <h2 style="margin: 0 0 8px; color: #0f172a;">New MindKatha Session Request</h2>',
    '  <p style="margin: 0 0 18px; font-size: 14px; color: #475569; line-height: 1.5;">This slot has <strong>not</strong> been booked on your calendar yet. Click <strong>Confirm &amp; Book Calendar Slot</strong> to lock the calendar, or tap a <strong>1-Tap WhatsApp</strong> button to message ' + safeName + ' with pre-filled details.</p>',
    '  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 22px; background: #f8fafc; border-radius: 12px; padding: 12px;">',
    '    <tr><td style="padding: 8px 12px; color: #64748b;"><strong>Client Name:</strong></td><td style="padding: 8px 12px;">' + safeName + '</td></tr>',
    '    <tr><td style="padding: 8px 12px; color: #64748b;"><strong>WhatsApp / Mobile:</strong></td><td style="padding: 8px 12px;">' + safePhone + '</td></tr>',
    '    <tr><td style="padding: 8px 12px; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 12px;">' + safeEmail + '</td></tr>',
    '    <tr><td style="padding: 8px 12px; color: #64748b;"><strong>Requested Slot:</strong></td><td style="padding: 8px 12px;"><strong>' + safeDayLabel + ' • ' + safeSlot + ' IST</strong></td></tr>',
    '    <tr><td style="padding: 8px 12px; color: #64748b;"><strong>Format:</strong></td><td style="padding: 8px 12px;">' + safeMode + '</td></tr>',
    '    <tr><td style="padding: 8px 12px; color: #64748b;"><strong>Care Pathway:</strong></td><td style="padding: 8px 12px;">' + safeService + '</td></tr>',
    '  </table>',
    '  <div style="margin-bottom: 14px;">',
    '    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin-bottom: 8px;">Step 1: Calendar Decision</div>',
    '    <a href="' + approveUrl + '" style="display: inline-block; padding: 13px 22px; background: #059669; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 13px; margin-right: 10px; margin-bottom: 8px;">&#10003; Confirm &amp; Book Calendar Slot</a>',
    '    <a href="' + declineUrl + '" style="display: inline-block; padding: 13px 20px; background: #f1f5f9; color: #be123c; border: 1px solid #fecdd3; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 13px; margin-bottom: 8px;">&#10005; Decline / Keep Slot Open</a>',
    '  </div>',
    '  <div style="padding-top: 14px; border-top: 1px solid #e2e8f0;">',
    '    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin-bottom: 8px;">1-Tap WhatsApp to ' + safeName + ' (Pre-Filled with Booking Details)</div>',
    '    <a href="' + waConfirmLink + '" style="display: inline-block; padding: 10px 16px; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 12px; margin-right: 8px; margin-bottom: 6px;">WhatsApp: Confirm Slot &rarr;</a>',
    '    <a href="' + waRescheduleLink + '" style="display: inline-block; padding: 10px 16px; background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 12px; margin-right: 8px; margin-bottom: 6px;">WhatsApp: Propose New Time &rarr;</a>',
    '    <a href="' + waInquiryLink + '" style="display: inline-block; padding: 10px 16px; background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 12px; margin-bottom: 6px;">WhatsApp: Quick Chat &rarr;</a>',
    '  </div>',
    '</div>'
  ].join('\n');

  MailApp.sendEmail({
    to: PRACTICE_EMAIL,
    subject: emailSubject,
    htmlBody: emailHtml
  });

  // 2. Send "Request Pending Confirmation" Email to Client (if clientEmail was entered)
  if (data.clientEmail && data.clientEmail.indexOf('@') !== -1) {
    const clientSubject = 'MindKatha Session Request Received (Pending Confirmation) — ' + data.dayLabel + ' at ' + data.slot + ' IST';
    const clientHtml = [
      '<div style="font-family: Arial, sans-serif; max-width: 560px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; color: #0f172a;">',
      '  <div style="display: inline-block; padding: 4px 12px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;">Pending Therapist Confirmation</div>',
      '  <h2 style="margin: 0 0 8px; color: #0284c7;">We Have Received Your Session Request</h2>',
      '  <p style="margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.5;">Hi ' + safeName + ', thank you for reaching out to MindKatha. Your preferred slot has been shared with Leona Lahkar for review:</p>',
      '  <p style="margin: 0 0 16px; font-size: 14px; background: #f8fafc; padding: 14px; border-radius: 12px;"><strong>Requested Date &amp; Time:</strong> ' + safeDayLabel + ' at ' + safeSlot + ' IST<br/>',
      '  <strong>Format:</strong> ' + safeMode + '<br/>',
      '  <strong>Care Pathway:</strong> ' + safeService + '</p>',
      '  <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">Once Leona confirms the slot, you will receive your official Google Calendar invitation and confirmation message via email and WhatsApp (' + safePhone + ').</p>',
      '</div>'
    ].join('\n');

    MailApp.sendEmail({
      to: data.clientEmail,
      subject: clientSubject,
      htmlBody: clientHtml
    });
  }

  return jsonResponse({ status: 'ok', message: 'Approval request sent to Leona.' });
}

/**
 * STAGE 2A: Leona clicks "Confirm & Book Calendar Slot" in her email.
 * Creates the Google Calendar event, invites the patient, and sends confirmation email.
 */
function handleApproveBooking(data) {
  const dateStr = data.date; // 'YYYY-MM-DD'
  const slotLabel = data.slot; // e.g. '03:00 PM'
  const hour = SLOT_START_HOURS[slotLabel] || 15;
  const durationMinutes = Number(data.durationMinutes) || 50;

  const startTime = new Date(dateStr + 'T' + String(hour).padStart(2, '0') + ':00:00+05:30');
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

  const calendar = CalendarApp.getDefaultCalendar();
  const existingEvents = calendar.getEvents(startTime, endTime).filter(function (ev) {
    return !ev.isAllDayEvent();
  });

  const eventTitle = 'MindKatha Session: ' + data.clientName + ' (' + data.slot + ')';
  const safeName = escapeHtml(data.clientName);
  const safeDayLabel = escapeHtml(data.dayLabel);
  const safeSlot = escapeHtml(data.slot);
  const safeMode = escapeHtml(data.mode);
  const safeService = escapeHtml(data.service);
  const safeEmail = escapeHtml(data.clientEmail);

  // Only create the event if not already created
  if (existingEvents.length === 0) {
    const eventDescription = [
      'MindKatha Confirmed Clinical Consultation',
      '----------------------------------------',
      'Client Name: ' + data.clientName,
      'WhatsApp / Mobile: ' + data.phoneNumber,
      'Client Email: ' + (data.clientEmail || 'Not provided'),
      'Care Pathway: ' + data.service,
      'Format: ' + data.mode,
      'Date & Time: ' + data.dayLabel + ' at ' + data.slot + ' IST',
      'Status: Confirmed by Leona Lahkar'
    ].join('\n');

    const eventOptions = {
      description: eventDescription,
      location: data.mode
    };

    if (data.clientEmail && data.clientEmail.indexOf('@') !== -1) {
      eventOptions.guests = data.clientEmail;
      eventOptions.sendInvites = true;
    }

    calendar.createEvent(eventTitle, startTime, endTime, eventOptions);

    // Send Final Confirmation Email to Client
    if (data.clientEmail && data.clientEmail.indexOf('@') !== -1) {
      const clientSubject = 'Confirmed: MindKatha Session on ' + data.dayLabel + ' at ' + data.slot + ' IST';
      const clientHtml = [
        '<div style="font-family: Arial, sans-serif; max-width: 560px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; color: #0f172a;">',
        '  <div style="display: inline-block; padding: 4px 12px; border-radius: 999px; background: #d1fae5; color: #047857; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;">Session Confirmed</div>',
        '  <h2 style="margin: 0 0 8px; color: #059669;">Your Session is Confirmed</h2>',
        '  <p style="margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.5;">Hi ' + safeName + ', Leona Lahkar has confirmed your session slot at MindKatha. A Google Calendar invitation has also been sent to your email.</p>',
        '  <p style="margin: 0 0 16px; font-size: 14px; background: #f8fafc; padding: 14px; border-radius: 12px;"><strong>Date &amp; Time:</strong> ' + safeDayLabel + ' at ' + safeSlot + ' IST<br/>',
        '  <strong>Format:</strong> ' + safeMode + '<br/>',
        '  <strong>Care Pathway:</strong> ' + safeService + '</p>',
        '  <p style="margin: 0; font-size: 13px; color: #64748b;">If you have any questions prior to your session, feel free to reply to this email.</p>',
        '</div>'
      ].join('\n');

      MailApp.sendEmail({
        to: data.clientEmail,
        subject: clientSubject,
        htmlBody: clientHtml
      });
    }
  }

  const waConfirmLink = buildPrefilledWhatsAppUrl(data, 'confirm');

  return htmlActionPage({
    badge: 'Confirmed & Booked',
    badgeBg: '#d1fae5',
    badgeColor: '#047857',
    title: 'Session Confirmed on Google Calendar',
    subtitle: 'The slot for <strong>' + safeName + '</strong> on <strong>' + safeDayLabel + ' at ' + safeSlot + ' IST</strong> is now locked on your Google Calendar' + (data.clientEmail ? ' and a calendar invite has been sent to ' + safeEmail : '') + '. Tap below to send the pre-filled WhatsApp confirmation to ' + safeName + ':',
    ctaLabel: '1-Tap WhatsApp Confirmation to ' + safeName,
    ctaUrl: waConfirmLink,
    ctaBg: '#059669'
  });
}

/**
 * STAGE 2B: Leona clicks "Decline / Propose New Time" in her email.
 * Keeps calendar open and notifies patient that Leona will propose an alternative slot.
 */
function handleDeclineBooking(data) {
  const safeName = escapeHtml(data.clientName);
  const safeDayLabel = escapeHtml(data.dayLabel);
  const safeSlot = escapeHtml(data.slot);
  const safePhone = escapeHtml(data.phoneNumber);

  if (data.clientEmail && data.clientEmail.indexOf('@') !== -1) {
    const clientSubject = 'Update on Your MindKatha Session Request — ' + data.dayLabel + ' at ' + data.slot + ' IST';
    const clientHtml = [
      '<div style="font-family: Arial, sans-serif; max-width: 560px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; color: #0f172a;">',
      '  <h2 style="margin: 0 0 8px; color: #0f172a;">Scheduling Update for Your Session Request</h2>',
      '  <p style="margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.5;">Hi ' + safeName + ', thank you for requesting a session with MindKatha for <strong>' + safeDayLabel + ' at ' + safeSlot + ' IST</strong>.</p>',
      '  <p style="margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.5;">Unfortunately, that specific time slot is unavailable. Leona will reach out to you on WhatsApp (' + safePhone + ') shortly to coordinate an alternative time that works comfortably for you.</p>',
      '</div>'
    ].join('\n');

    MailApp.sendEmail({
      to: data.clientEmail,
      subject: clientSubject,
      htmlBody: clientHtml
    });
  }

  const waRescheduleLink = buildPrefilledWhatsAppUrl(data, 'reschedule');

  return htmlActionPage({
    badge: 'Slot Not Booked',
    badgeBg: '#ffe4e6',
    badgeColor: '#be123c',
    title: 'Request Declined — Calendar Kept Open',
    subtitle: 'Your calendar was not blocked for <strong>' + safeDayLabel + ' at ' + safeSlot + ' IST</strong>. Tap below to open WhatsApp with a pre-filled reschedule message for <strong>' + safeName + '</strong>:',
    ctaLabel: '1-Tap WhatsApp Reschedule to ' + safeName,
    ctaUrl: waRescheduleLink,
    ctaBg: '#0284c7'
  });
}

function htmlActionPage(opts) {
  const html = [
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>' + opts.title + ' — MindKatha</title></head>',
    '<body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:90vh;">',
    '  <div style="max-width:480px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;padding:32px;text-align:center;box-shadow:0 12px 32px rgba(15,23,42,0.06);">',
    '    <div style="display:inline-block;padding:6px 14px;border-radius:999px;background:' + opts.badgeBg + ';color:' + opts.badgeColor + ';font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;">' + opts.badge + '</div>',
    '    <h1 style="margin:0 0 10px;font-size:22px;color:#0f172a;">' + opts.title + '</h1>',
    '    <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">' + opts.subtitle + '</p>',
    '    <a href="' + opts.ctaUrl + '" style="display:inline-block;padding:14px 24px;border-radius:999px;background:' + opts.ctaBg + ';color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">' + opts.ctaLabel + '</a>',
    '  </div>',
    '</body></html>'
  ].join('\n');

  return HtmlService.createHtmlOutput(html).setTitle(opts.title + ' — MindKatha');
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
