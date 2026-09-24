import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth
} from 'firebase/auth';
import { LEONA_FIREBASE_CONFIG, isFirebaseConfigured } from '../config/firebase.config';

export interface OtpSession {
  phoneNumber: string;
  clientName: string;
  generatedOtp?: string;
  challengeToken?: string;
  expiresAt: number;
  attemptsLeft: number;
  isVerified: boolean;
  whatsappUrl: string;
  provider?: string;
  isLiveGateway?: boolean;
  deliveredVia?: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  simulatedOtp?: string;
  whatsappUrl?: string;
  challengeToken?: string;
  provider?: string;
  isLiveGateway?: boolean;
  deliveredVia?: string;
  verifiedBookingToken?: string;
}

export interface BookingConfirmResponse {
  success: boolean;
  bookingReference: string;
  whatsappConfirmationUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private http = inject(HttpClient);

  private activeSession: OtpSession | null = null;
  private resendTimer$ = new BehaviorSubject<number>(0);
  private timerInterval: any = null;

  // Firebase Phone Auth State (Leona's Account)
  private firebaseApp: FirebaseApp | null = null;
  private firebaseAuth: Auth | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private firebaseConfirmationResult: ConfirmationResult | null = null;

  readonly timer$ = this.resendTimer$.asObservable();
  readonly practiceWhatsAppNumber = '919876543210'; // MindKatha official WhatsApp

  /**
   * Dispatches a 6-digit OTP:
   * 1. Priority 1: Leona's Firebase Phone Authentication (`signInWithPhoneNumber`) once `firebase.config.ts` is populated.
   * 2. Priority 2: Node.js BFF (/api/otp/send) or Local Sandbox fallback while waiting for Leona's keys.
   */
  sendWhatsAppOtp(phoneNumber: string, clientName: string = 'Client'): Observable<OtpResponse> {
    const cleanPhone = this.formatE164(phoneNumber);

    // Priority 1: Use Leona's Firebase Phone Auth if configured
    if (isFirebaseConfigured()) {
      return this.sendFirebasePhoneOtp(cleanPhone, clientName);
    }

    // Priority 2: BFF Server / Local Sandbox
    return this.http
      .post<OtpResponse>('/api/otp/send', {
        phoneNumber: cleanPhone,
        clientName
      })
      .pipe(
        tap(res => {
          if (res.success) {
            this.activeSession = {
              phoneNumber: cleanPhone,
              clientName,
              generatedOtp: res.simulatedOtp,
              challengeToken: res.challengeToken,
              expiresAt: Date.now() + 10 * 60 * 1000,
              attemptsLeft: 3,
              isVerified: false,
              whatsappUrl: res.whatsappUrl || '',
              provider: res.provider || 'sandbox',
              isLiveGateway: Boolean(res.isLiveGateway),
              deliveredVia: res.deliveredVia || 'WhatsApp Passkey Service'
            };
            this.startResendCountdown(60);
          }
        }),
        catchError(err => {
          if (err?.error?.message) {
            return of({
              success: false,
              message: err.error.message
            });
          }
          return this.sendLocalFallbackOtp(cleanPhone, clientName);
        })
      );
  }

  /**
   * Dispatches a real 6-digit SMS OTP via Leona's Firebase Phone Authentication
   */
  private sendFirebasePhoneOtp(cleanPhone: string, clientName: string): Observable<OtpResponse> {
    try {
      if (!this.firebaseApp) {
        const existingApps = getApps();
        this.firebaseApp = existingApps.length > 0 ? existingApps[0] : initializeApp(LEONA_FIREBASE_CONFIG);
        this.firebaseAuth = getAuth(this.firebaseApp);
      }

      if (!this.firebaseAuth) {
        throw new Error('Firebase Auth could not be initialized.');
      }

      // Clear any stale reCAPTCHA instance before re-rendering
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch {
          // Ignore cleanup warning
        }
        this.recaptchaVerifier = null;
      }

      this.recaptchaVerifier = new RecaptchaVerifier(this.firebaseAuth, 'firebase-recaptcha-container', {
        size: 'invisible'
      });

      return from(signInWithPhoneNumber(this.firebaseAuth, cleanPhone, this.recaptchaVerifier)).pipe(
        map(confirmationResult => {
          this.firebaseConfirmationResult = confirmationResult;
          this.activeSession = {
            phoneNumber: cleanPhone,
            clientName,
            expiresAt: Date.now() + 10 * 60 * 1000,
            attemptsLeft: 3,
            isVerified: false,
            whatsappUrl: '',
            provider: 'firebase',
            isLiveGateway: true,
            deliveredVia: 'Google Firebase SMS Auth (Leona Account)'
          };
          this.startResendCountdown(60);

          return {
            success: true,
            provider: 'firebase',
            isLiveGateway: true,
            deliveredVia: 'Google Firebase SMS Auth',
            message: `6-digit SMS OTP sent to ${cleanPhone}`
          };
        }),
        catchError(err => {
          const friendlyMsg = this.mapFirebaseError(err?.code || err?.message || '');
          return of({
            success: false,
            message: friendlyMsg
          });
        })
      );
    } catch (err: any) {
      return of({
        success: false,
        message: err?.message || 'Unable to initialize Firebase Phone Auth.'
      });
    }
  }

  /**
   * Compatibility alias for sendOtp
   */
  sendOtp(phoneNumber: string, clientName: string = 'Client'): Observable<OtpResponse> {
    return this.sendWhatsAppOtp(phoneNumber, clientName);
  }

  /**
   * Verify entered 6-digit OTP (Firebase ConfirmationResult -> BFF -> Local Sandbox)
   */
  verifyOtp(enteredOtp: string): Observable<OtpResponse> {
    const trimmed = enteredOtp.replace(/\D/g, '').trim();

    if (!this.activeSession) {
      return of({
        success: false,
        message: 'No active verification session found. Please request a new code.'
      });
    }

    if (Date.now() > this.activeSession.expiresAt) {
      return of({
        success: false,
        message: 'Verification code has expired. Please tap Resend Code.'
      });
    }

    // 1. Verify via Leona's Firebase Phone Auth if active
    if (this.activeSession.provider === 'firebase' && this.firebaseConfirmationResult) {
      return from(this.firebaseConfirmationResult.confirm(trimmed)).pipe(
        map(() => {
          if (this.activeSession) {
            this.activeSession.isVerified = true;
          }
          this.stopTimer();
          return {
            success: true,
            message: 'Mobile number verified via Firebase Auth.'
          };
        }),
        catchError(err => {
          return of({
            success: false,
            message: this.mapFirebaseError(err?.code || 'auth/invalid-verification-code')
          });
        })
      );
    }

    // 2. Verify via BFF server HMAC token if active
    if (this.activeSession.challengeToken) {
      return this.http
        .post<OtpResponse>('/api/otp/verify', {
          phoneNumber: this.activeSession.phoneNumber,
          otp: trimmed,
          challengeToken: this.activeSession.challengeToken
        })
        .pipe(
          tap(res => {
            if (res.success && this.activeSession) {
              this.activeSession.isVerified = true;
              this.stopTimer();
            }
          }),
          catchError(err => {
            const msg = err?.error?.message || 'Incorrect verification code. Please check the 6-digit passkey.';
            return of({
              success: false,
              message: msg
            });
          })
        );
    }

    // 3. Fallback verification when in local sandbox mode
    if (this.activeSession.attemptsLeft <= 0) {
      return of({
        success: false,
        message: 'Too many incorrect attempts. Please request a new code.'
      });
    }

    if (trimmed === this.activeSession.generatedOtp) {
      this.activeSession.isVerified = true;
      this.stopTimer();
      return of({
        success: true,
        message: 'Number verified successfully.'
      });
    }

    this.activeSession.attemptsLeft -= 1;
    return of({
      success: false,
      message: `Incorrect code. ${this.activeSession.attemptsLeft} attempt(s) remaining.`
    });
  }

  /**
   * Finalize clinical booking and generate verified WhatsApp confirmation ticket
   */
  confirmClinicalBooking(payload: {
    phoneNumber: string;
    clientName: string;
    service: string;
    date: string;
    slot: string;
    mode: 'telehealth' | 'studio';
  }): Observable<BookingConfirmResponse> {
    const cleanPhone = this.formatE164(payload.phoneNumber);
    return this.http
      .post<BookingConfirmResponse>('/api/otp/confirm-booking', {
        ...payload,
        phoneNumber: cleanPhone
      })
      .pipe(
        catchError(() => {
          const bookingReference = 'MK-' + Math.floor(100000 + Math.random() * 900000);
          const modeLabel = payload.mode === 'studio' ? 'In-Person Studio (Viman Nagar, Pune)' : 'Encrypted Online Video';
          const text = encodeURIComponent(
            `Hi Leona (MindKatha), my booking is confirmed!\n\n` +
            `• Reference: ${bookingReference}\n` +
            `• Patient: ${payload.clientName} (${cleanPhone})\n` +
            `• Pathway: ${payload.service}\n` +
            `• Format: ${modeLabel}\n` +
            `• Date & Slot: ${payload.date} | ${payload.slot} IST`
          );
          return of({
            success: true,
            bookingReference,
            whatsappConfirmationUrl: `https://wa.me/${this.practiceWhatsAppNumber}?text=${text}`
          });
        })
      );
  }

  resendOtp(): Observable<OtpResponse> {
    if (!this.activeSession) {
      return of({
        success: false,
        message: 'Please enter your phone number first.'
      });
    }
    return this.sendWhatsAppOtp(this.activeSession.phoneNumber, this.activeSession.clientName);
  }

  getActiveWhatsAppUrl(): string | null {
    return this.activeSession ? this.activeSession.whatsappUrl : null;
  }

  private mapFirebaseError(code: string): string {
    if (code.includes('operation-not-allowed')) {
      return 'Firebase Phone Auth is not enabled yet: in Firebase Console -> Authentication -> Sign-in method -> Click "Phone" -> Enable -> Save.';
    }
    if (code.includes('billing-not-enabled')) {
      return 'Firebase Spark ($0) Plan: Either add this number under Firebase Console -> Authentication -> Sign-in method -> Phone -> "Phone numbers for testing", or enable Blaze plan for live carrier SMS.';
    }
    if (code.includes('invalid-phone-number')) {
      return 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (code.includes('too-many-requests')) {
      return 'Too many OTP requests for this number. Please wait a few minutes.';
    }
    if (code.includes('invalid-verification-code')) {
      return 'Incorrect 6-digit OTP code. Please double-check your SMS.';
    }
    if (code.includes('code-expired')) {
      return 'This OTP code has expired. Please tap Resend Code.';
    }
    return `Firebase Auth notice (${code || 'check console'}): Ensure Phone sign-in is enabled in mindkatha-f3ba9.`;
  }

  private sendLocalFallbackOtp(cleanPhone: string, clientName: string): Observable<OtpResponse> {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const messageText = encodeURIComponent(
      `MindKatha Clinical Practice: Verification OTP for ${clientName} (${cleanPhone}) is ${generatedOtp}. Enter this 6-digit code on the appointment screen to confirm your session.`
    );
    const whatsappUrl = `https://wa.me/${this.practiceWhatsAppNumber}?text=${messageText}`;

    this.activeSession = {
      phoneNumber: cleanPhone,
      clientName,
      generatedOtp,
      expiresAt,
      attemptsLeft: 3,
      isVerified: false,
      whatsappUrl,
      provider: 'sandbox',
      isLiveGateway: false,
      deliveredVia: 'Instant Passkey (Local Mode)'
    };

    this.startResendCountdown(60);

    return of({
      success: true,
      message: `WhatsApp passkey generated for ${cleanPhone}`,
      simulatedOtp: generatedOtp,
      whatsappUrl,
      provider: 'sandbox',
      isLiveGateway: false,
      deliveredVia: 'Instant Passkey (Local Mode)'
    }).pipe(delay(150));
  }

  private formatE164(phone: string): string {
    const rawDigits = phone.replace(/\D/g, '');
    if (rawDigits.length === 10) {
      return `+91${rawDigits}`;
    }
    return phone.startsWith('+') ? phone : `+${rawDigits}`;
  }

  private startResendCountdown(seconds: number): void {
    this.stopTimer();
    this.resendTimer$.next(seconds);

    this.timerInterval = setInterval(() => {
      const current = this.resendTimer$.value;
      if (current <= 1) {
        this.stopTimer();
      } else {
        this.resendTimer$.next(current - 1);
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.resendTimer$.next(0);
  }
}
