import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { OtpService } from '../../core/services/otp.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface DrawerServiceOption {
  name: string;
  category: string;
  duration: string;
  icon: string;
}

@Component({
  selector: 'app-booking-drawer',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './booking-drawer.component.html',
  styleUrl: './booking-drawer.component.scss'
})
export class BookingDrawerComponent implements OnInit, OnDestroy {
  private bookingService = inject(BookingService);
  private otpService = inject(OtpService);

  isOpen$ = this.bookingService.isOpen$;
  currentStep: 'mobile' | 'otp' | 'calendar' | 'pay' | 'success' = 'mobile';
  
  // Client Data
  clientName = '';
  phoneNumber = '';
  sessionMode: 'telehealth' | 'studio' = 'telehealth';
  
  serviceOptions: DrawerServiceOption[] = [
    { name: 'Free 15-Minute Discovery Audio Call (Complimentary)', category: 'Discovery', duration: '15 mins', icon: 'ph-phone-call' },
    { name: 'Individual Psychotherapy & Emotional Regulation (50 mins)', category: 'Psychotherapy', duration: '50 mins', icon: 'ph-user' },
    { name: 'Occupational Burnout & High-Performance Restoration (50 mins)', category: 'Burnout Care', duration: '50 mins', icon: 'ph-briefcase' },
    { name: 'Trauma-Informed Healing & Complex Grief Processing (50 mins)', category: 'Trauma Care', duration: '50 mins', icon: 'ph-shield-check' },
    { name: 'Comprehensive Adult ADHD Diagnostic Evaluation', category: 'Neurodivergence', duration: 'Standardized Battery', icon: 'ph-lightning' },
    { name: 'Neurodivergent Executive Functioning & De-Masking Support (50 mins)', category: 'Neurodivergence', duration: '50 mins', icon: 'ph-sparkle' },
    { name: 'Couples & Relational Communication Mediation (60 mins)', category: 'Relational Care', duration: '60 mins', icon: 'ph-users-three' },
    { name: 'Pre-Marital Alignment & Relational Readiness Track', category: 'Relational Care', duration: 'Structured Track', icon: 'ph-heart' },
    { name: 'Queer & LGBTQIA+ Affirmative Psychotherapy (50 mins)', category: 'Affirmative Care', duration: '50 mins', icon: 'ph-rainbow' },
    { name: 'Standardized Psychometric & Personality Assessment (MCMI-IV, MMPI-2)', category: 'Testing', duration: 'Clinical Diagnostic', icon: 'ph-brain' },
    { name: 'Adolescent, College & Emerging Adulthood Mentorship (50 mins)', category: 'Youth Care', duration: '50 mins', icon: 'ph-flower-lotus' },
    { name: 'Grief, Bereavement & Life Transition Counseling (50 mins)', category: 'Compassion Care', duration: '50 mins', icon: 'ph-compass' },
    { name: 'Perfectionism, Self-Worth & Inner Critic Restructuring (50 mins)', category: 'Specialized Care', duration: '50 mins', icon: 'ph-user-focus' },
    { name: 'Other / Custom Clinical Inquiry', category: 'Custom Care', duration: 'Custom Inquiry', icon: 'ph-chat-circle-dots' }
  ];

  selectedService: string = 'Free 15-Minute Discovery Audio Call (Complimentary)';
  customServiceDetails: string = '';
  isServiceDropdownOpen: boolean = false;

  toggleServiceDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isServiceDropdownOpen = !this.isServiceDropdownOpen;
  }

  selectServiceOption(serviceName: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedService = serviceName;
    this.isServiceDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.drawer-service-dropdown-container')) {
      this.isServiceDropdownOpen = false;
    }
  }
  
  // OTP State
  isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  qrCodeUrl: string | null = null;
  whatsAppWebUrl: string | null = null;
  otpDigits: string[] = ['', '', '', '', '', ''];
  simulatedIncomingOtp: string | null = null;
  otpError: string | null = null;
  isSendingOtp = false;
  isVerifyingOtp = false;
  resendCountdown = 0;
  private timerSub?: Subscription;

  // Slot State
  selectedDate: string = '';
  selectedSlot = '03:00 PM';
  bookingRef = '';
  minBookingDate: string = '';
  maxBookingDate: string = '';
  allowedDays: { dateString: string; label: string; dayName: string; isWeekend: boolean }[] = [];

  availableSlots: string[] = [
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM'
  ];

  ngOnInit(): void {
    // Generate strictly 1-week rolling calendar (7 days total)
    const today = new Date();
    this.allowedDays = [];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      this.allowedDays.push({ dateString, label, dayName, isWeekend });
    }

    this.minBookingDate = this.allowedDays[0].dateString;
    this.maxBookingDate = this.allowedDays[this.allowedDays.length - 1].dateString;
    this.selectedDate = this.allowedDays[0].dateString;

    this.timerSub = this.otpService.timer$.subscribe(seconds => {
      this.resendCountdown = seconds;
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  closeDrawer(): void {
    this.bookingService.close();
    this.currentStep = 'mobile';
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError = null;
    this.simulatedIncomingOtp = null;
  }

  sendDrawerOtp(): void {
    const clean = this.phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      this.otpError = 'Please enter a valid 10-digit WhatsApp number.';
      return;
    }

    this.otpError = null;
    this.currentStep = 'calendar';
  }

  openWhatsAppChat(): void {
    const url = this.otpService.getActiveWhatsAppUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  openWhatsAppWeb(): void {
    if (this.whatsAppWebUrl) {
      window.open(this.whatsAppWebUrl, '_blank', 'noopener,noreferrer');
    } else {
      this.openWhatsAppChat();
    }
  }

  autoFillDemoOtp(): void {
    if (this.simulatedIncomingOtp && this.simulatedIncomingOtp.length === 6) {
      this.otpDigits = this.simulatedIncomingOtp.split('');
      this.verifyDrawerOtp();
    }
  }

  onOtpInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value;

    if (val.length > 1) {
      const pasted = val.replace(/\D/g, '').slice(0, 6);
      if (pasted.length === 6) {
        this.otpDigits = pasted.split('');
        this.verifyDrawerOtp();
        return;
      }
    }

    this.otpDigits[index] = val.slice(-1);

    if (val && index < 5) {
      const nextInput = document.getElementById(`drawer-otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    if (this.otpDigits.every(d => d.trim() !== '')) {
      this.verifyDrawerOtp();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prev = document.getElementById(`drawer-otp-${index - 1}`) as HTMLInputElement;
      prev?.focus();
    }
  }

  verifyDrawerOtp(): void {
    const entered = this.otpDigits.join('');
    if (entered.length < 6) {
      this.otpError = 'Please enter all 6 digits.';
      return;
    }

    this.isVerifyingOtp = true;
    this.otpError = null;

    this.otpService.verifyOtp(entered).subscribe({
      next: (res) => {
        this.isVerifyingOtp = false;
        if (res.success) {
          this.currentStep = 'calendar';
          this.otpError = null;
        } else {
          this.otpError = res.message;
        }
      },
      error: (err) => {
        this.isVerifyingOtp = false;
        this.otpError = err?.message || 'Verification failed. Please check the code.';
      }
    });
  }

  resendOtp(): void {
    if (this.resendCountdown > 0) return;
    this.otpError = null;
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpService.resendOtp().subscribe({
      next: (res) => {
        this.simulatedIncomingOtp = res.simulatedOtp || null;
      },
      error: (err) => {
        this.otpError = err?.message || 'Failed to resend code.';
      }
    });
  }

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  proceedToConfirm(): void {
    this.currentStep = 'pay';
  }

  goBack(step: 'mobile' | 'otp' | 'calendar'): void {
    this.currentStep = step;
  }

  completeCheckout(): void {
    this.bookingRef = 'MK-' + Math.floor(100000 + Math.random() * 900000);
    this.currentStep = 'success';
  }
}
