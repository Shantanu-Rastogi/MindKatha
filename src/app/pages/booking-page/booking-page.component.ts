import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';

export interface ServiceOption {
  name: string;
  category: string;
  duration: string;
  durationMinutes: number;
  icon: string;
}

export interface BookingDayChip {
  dateString: string;
  label: string;
  dayName: string;
  isWeekend: boolean;
  weekIndex: 0 | 1;
}

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ScrollRevealDirective],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);

  /**
   * Deployed Google Apps Script Web App URL (from psychotherapy.leona@gmail.com)
   */
  readonly calendarWebhookUrl: string =
    'https://script.google.com/macros/s/AKfycbxJ6r6WqItOdO3vpetfXsCw9rn-Y9VuwKBZFCbn7Ok44bj62Ia_R6sy4EUavsEjeUEl/exec';

  private readonly localBookedStorageKey = 'mindkatha_booked_slots_v1';

  /**
   * Clean 3-Stage Clinical Booking Flow:
   * 1 = Choose Pathway, Format, Day (14-day window) & Preferred Time
   * 2 = Patient Contact Details (debounced validation after typing stops + red validation on submit click)
   * 3 = Request Submitted — Calendar Blocked & Notification Sent
   */
  currentStep = 1;

  // Client Intake Data
  clientName = '';
  phoneNumber = '';
  clientEmail = '';
  consultationMode: 'telehealth' | 'studio' = 'telehealth';

  // Calendar Sync & Submission State
  busySlotsMap: Record<string, string[]> = {};
  isLoadingSlots = false;
  isSubmittingBooking = false;
  calendarSynced = false;

  // Debounced Validation State (only set after user stops typing or clicks submit)
  nameValidated = false;
  phoneValidated = false;
  emailValidated = false;
  isTypingName = false;
  isTypingPhone = false;
  isTypingEmail = false;
  submitAttempted = false;

  private nameTypingTimer?: ReturnType<typeof setTimeout>;
  private phoneTypingTimer?: ReturnType<typeof setTimeout>;
  private emailTypingTimer?: ReturnType<typeof setTimeout>;

  readonly practiceWhatsAppNumber = '919876543210';
  readonly practiceEmail = 'psychotherapy.leona@gmail.com';

  serviceOptions: ServiceOption[] = [
    { name: 'Free 15-Minute Discovery Audio Call (Complimentary)', category: 'Discovery', duration: '15 mins', durationMinutes: 15, icon: 'ph-phone-call' },
    { name: 'Individual Psychotherapy & Emotional Regulation', category: 'Psychotherapy', duration: '50 mins', durationMinutes: 50, icon: 'ph-user' },
    { name: 'Occupational Burnout & High-Performance Restoration', category: 'Burnout Care', duration: '50 mins', durationMinutes: 50, icon: 'ph-briefcase' },
    { name: 'Trauma-Informed Healing & Complex Grief Processing', category: 'Trauma Care', duration: '50 mins', durationMinutes: 50, icon: 'ph-shield-check' },
    { name: 'Comprehensive Adult ADHD Diagnostic Evaluation', category: 'Neurodivergence', duration: 'Standardized Battery', durationMinutes: 50, icon: 'ph-lightning' },
    { name: 'Neurodivergent Executive Functioning & De-Masking Support', category: 'Neurodivergence', duration: '50 mins', durationMinutes: 50, icon: 'ph-sparkle' },
    { name: 'Couples & Relational Communication Mediation', category: 'Relational Care', duration: '60 mins', durationMinutes: 60, icon: 'ph-users-three' },
    { name: 'Pre-Marital Alignment & Relational Readiness Track', category: 'Relational Care', duration: 'Structured Track', durationMinutes: 50, icon: 'ph-heart' },
    { name: 'Queer, Trans & LGBTQIA+ Affirmative Psychotherapy', category: 'Affirmative Care', duration: '50 mins', durationMinutes: 50, icon: 'ph-rainbow' },
    { name: 'Standardized Psychometric & Personality Assessment (MCMI-IV, MMPI-2)', category: 'Testing', duration: 'Clinical Diagnostic', durationMinutes: 50, icon: 'ph-brain' },
    { name: 'Adolescent, College & Emerging Adulthood Mentorship', category: 'Youth Care', duration: '50 mins', durationMinutes: 50, icon: 'ph-flower-lotus' },
    { name: 'Grief, Bereavement & Life Transition Counseling', category: 'Compassion Care', duration: '50 mins', durationMinutes: 50, icon: 'ph-compass' },
    { name: 'Perfectionism, Self-Worth & Inner Critic Restructuring', category: 'Specialized Care', duration: '50 mins', durationMinutes: 50, icon: 'ph-user-focus' },
    { name: 'Other / Custom Clinical Inquiry', category: 'Custom Care', duration: 'Custom Inquiry', durationMinutes: 50, icon: 'ph-chat-circle-dots' }
  ];

  selectedService: string = 'Free 15-Minute Discovery Audio Call (Complimentary)';
  customServiceDetails: string = '';
  isServiceDropdownOpen: boolean = false;

  // 14-Day (2-Week) Slot State
  selectedDate: string = '';
  selectedWeek: 0 | 1 = 0;
  selectedSlot: string | null = '03:00 PM';
  whatsappConfirmationUrl: string = '';
  mailtoConfirmationUrl: string = '';
  allowedDays: BookingDayChip[] = [];

  availableSlots: string[] = [
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM'
  ];

  private querySub?: Subscription;

  ngOnInit(): void {
    // Generate 14-day (2-week) rolling calendar
    const today = new Date();
    this.allowedDays = [];

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const weekIndex: 0 | 1 = i < 7 ? 0 : 1;

      this.allowedDays.push({ dateString, label, dayName, isWeekend, weekIndex });
    }

    this.selectedDate = this.allowedDays[0].dateString;

    // Load locally stored booked slots and fetch live Google Calendar busy slots
    this.loadLocalBookedSlots();
    this.fetchGoogleCalendarBusySlots();

    // Deep Linking: Auto-select service and mode from query params
    this.querySub = this.route.queryParams.subscribe(params => {
      if (params['service']) {
        const queryTerm = params['service'].toLowerCase();
        const matched = this.serviceOptions.find(opt =>
          opt.name.toLowerCase().includes(queryTerm) ||
          queryTerm.includes(opt.name.toLowerCase().split('(')[0].trim()) ||
          opt.category.toLowerCase().includes(queryTerm)
        );
        if (matched) {
          this.selectedService = matched.name;
        } else {
          this.selectedService = params['service'];
        }
      }
      if (params['mode'] === 'studio' || params['mode'] === 'telehealth') {
        this.consultationMode = params['mode'];
      }
    });
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
    clearTimeout(this.nameTypingTimer);
    clearTimeout(this.phoneTypingTimer);
    clearTimeout(this.emailTypingTimer);
  }

  private loadLocalBookedSlots(): void {
    try {
      const raw = localStorage.getItem(this.localBookedStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string[]>;
        this.busySlotsMap = { ...parsed };
        this.ensureSelectedSlotIsAvailable();
      }
    } catch {
      // Ignore storage read errors
    }
  }

  private markSlotBookedLocally(dateString: string, slot: string): void {
    const existing = this.busySlotsMap[dateString] || [];
    if (!existing.includes(slot)) {
      this.busySlotsMap = {
        ...this.busySlotsMap,
        [dateString]: [...existing, slot]
      };
    }
    try {
      localStorage.setItem(this.localBookedStorageKey, JSON.stringify(this.busySlotsMap));
    } catch {
      // Ignore storage write errors
    }
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    // Automatically re-sync with Leona's Google Calendar whenever the user returns to this tab
    this.fetchGoogleCalendarBusySlots();
  }

  async fetchGoogleCalendarBusySlots(): Promise<void> {
    if (!this.calendarWebhookUrl || this.allowedDays.length === 0) {
      return;
    }

    this.isLoadingSlots = true;
    const startDate = this.allowedDays[0].dateString;
    const endDate = this.allowedDays[this.allowedDays.length - 1].dateString;

    try {
      const url = `${this.calendarWebhookUrl}?action=getBusySlots&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}&_t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.busySlots && typeof data.busySlots === 'object') {
          // Google Calendar is the single source of truth:
          // Any event added in Google Calendar blocks the slot on the website,
          // and any event deleted in Google Calendar immediately frees the slot.
          this.busySlotsMap = { ...data.busySlots };
          try {
            localStorage.setItem(this.localBookedStorageKey, JSON.stringify(this.busySlotsMap));
          } catch {
            // Ignore storage write errors
          }
          this.calendarSynced = true;
          this.ensureSelectedSlotIsAvailable();
        }
      }
    } catch {
      // Fallback to local availability if offline
    } finally {
      this.isLoadingSlots = false;
    }
  }

  isSlotBooked(dateString: string, slot: string): boolean {
    const bookedForDay = this.busySlotsMap[dateString];
    return Array.isArray(bookedForDay) && bookedForDay.includes(slot);
  }

  private ensureSelectedSlotIsAvailable(): void {
    if (this.selectedSlot && !this.isSlotBooked(this.selectedDate, this.selectedSlot)) {
      return;
    }
    const firstOpen = this.availableSlots.find(s => !this.isSlotBooked(this.selectedDate, s));
    this.selectedSlot = firstOpen || null;
  }

  selectDate(dateString: string): void {
    this.selectedDate = dateString;
    this.ensureSelectedSlotIsAvailable();
  }

  get visibleWeekDays(): BookingDayChip[] {
    return this.allowedDays.filter(d => d.weekIndex === this.selectedWeek);
  }

  get weekOneRangeLabel(): string {
    if (this.allowedDays.length < 7) return 'This Week';
    return `${this.allowedDays[0].label} – ${this.allowedDays[6].label}`;
  }

  get weekTwoRangeLabel(): string {
    if (this.allowedDays.length < 14) return 'Next Week';
    return `${this.allowedDays[7].label} – ${this.allowedDays[13].label}`;
  }

  setWeek(week: 0 | 1): void {
    this.selectedWeek = week;
    const weekDays = this.visibleWeekDays;
    if (weekDays.length > 0 && !weekDays.some(d => d.dateString === this.selectedDate)) {
      this.selectDate(weekDays[0].dateString);
    }
  }

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
    if (!target.closest('.custom-service-dropdown-container')) {
      this.isServiceDropdownOpen = false;
    }
  }

  selectSlot(slot: string): void {
    if (this.isSlotBooked(this.selectedDate, slot)) {
      return;
    }
    this.selectedSlot = slot;
  }

  get selectedDayLabel(): string {
    const found = this.allowedDays.find(d => d.dateString === this.selectedDate);
    return found ? `${found.dayName}, ${found.label}` : this.selectedDate;
  }

  // Validation Getters
  get cleanPhoneDigits(): string {
    return this.phoneNumber.replace(/\D/g, '');
  }

  get isNameValid(): boolean {
    return this.clientName.trim().length >= 2;
  }

  get isPhoneValid(): boolean {
    return this.cleanPhoneDigits.length === 10;
  }

  get isEmailValid(): boolean {
    const trimmed = this.clientEmail.trim();
    if (!trimmed) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }

  get isStep2Valid(): boolean {
    return this.isNameValid && this.isPhoneValid && this.isEmailValid;
  }

  // Show field-level errors ONLY after user stops typing (or after submit is clicked)
  get showNameError(): boolean {
    return !this.isTypingName && (this.nameValidated || this.submitAttempted) && !this.isNameValid;
  }

  get showPhoneError(): boolean {
    return !this.isTypingPhone && (this.phoneValidated || this.submitAttempted) && !this.isPhoneValid;
  }

  get showEmailError(): boolean {
    return !this.isTypingEmail && (this.emailValidated || this.submitAttempted) && !this.isEmailValid;
  }

  get submitErrorMessage(): string {
    if (!this.submitAttempted || this.isStep2Valid) {
      return '';
    }
    if (!this.isNameValid && !this.isPhoneValid) {
      return 'Please enter your full name and a valid 10-digit mobile number to submit.';
    }
    if (!this.isNameValid) {
      return 'Please enter your full name (at least 2 characters) to submit.';
    }
    if (!this.isPhoneValid) {
      return 'Please enter a valid 10-digit WhatsApp / mobile number to submit.';
    }
    if (!this.isEmailValid) {
      return 'Please enter a valid email address or leave the optional field blank.';
    }
    return '';
  }

  // Debounced input handlers — validation activates 650ms after the user stops typing
  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.clientName = input.value;
    this.isTypingName = true;
    clearTimeout(this.nameTypingTimer);
    this.nameTypingTimer = setTimeout(() => {
      this.isTypingName = false;
      if (this.clientName.trim().length > 0) {
        this.nameValidated = true;
      }
    }, 650);
  }

  onNameBlur(): void {
    clearTimeout(this.nameTypingTimer);
    this.isTypingName = false;
    if (this.clientName.trim().length > 0) {
      this.nameValidated = true;
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.phoneNumber = input.value.replace(/\D/g, '').slice(0, 10);
    input.value = this.phoneNumber;
    this.isTypingPhone = true;
    clearTimeout(this.phoneTypingTimer);
    this.phoneTypingTimer = setTimeout(() => {
      this.isTypingPhone = false;
      if (this.cleanPhoneDigits.length > 0) {
        this.phoneValidated = true;
      }
    }, 650);
  }

  onPhoneBlur(): void {
    clearTimeout(this.phoneTypingTimer);
    this.isTypingPhone = false;
    if (this.cleanPhoneDigits.length > 0) {
      this.phoneValidated = true;
    }
  }

  onEmailInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.clientEmail = input.value;
    this.isTypingEmail = true;
    clearTimeout(this.emailTypingTimer);
    this.emailTypingTimer = setTimeout(() => {
      this.isTypingEmail = false;
      if (this.clientEmail.trim().length > 0) {
        this.emailValidated = true;
      }
    }, 650);
  }

  onEmailBlur(): void {
    clearTimeout(this.emailTypingTimer);
    this.isTypingEmail = false;
    if (this.clientEmail.trim().length > 0) {
      this.emailValidated = true;
    }
  }

  proceedToPatientDetails(): void {
    if (!this.selectedSlot || this.isSlotBooked(this.selectedDate, this.selectedSlot)) {
      return;
    }
    this.submitAttempted = false;
    this.currentStep = 2;
  }

  async confirmBooking(): Promise<void> {
    if (this.isSubmittingBooking) {
      return;
    }

    clearTimeout(this.nameTypingTimer);
    clearTimeout(this.phoneTypingTimer);
    clearTimeout(this.emailTypingTimer);
    this.isTypingName = false;
    this.isTypingPhone = false;
    this.isTypingEmail = false;
    this.submitAttempted = true;
    this.nameValidated = true;
    this.phoneValidated = true;
    this.emailValidated = true;

    if (!this.isStep2Valid || !this.selectedSlot) {
      return;
    }

    this.isSubmittingBooking = true;

    const cleanName = this.clientName.trim();
    const cleanPhone = this.cleanPhoneDigits;
    const cleanEmail = this.clientEmail.trim();

    const matchedOption = this.serviceOptions.find(o => o.name === this.selectedService);
    const durationMinutes = matchedOption ? matchedOption.durationMinutes : 50;

    const serviceLabel =
      this.selectedService === 'Other / Custom Clinical Inquiry' && this.customServiceDetails
        ? `Custom Inquiry: ${this.customServiceDetails}`
        : this.selectedService;

    const modeLabel =
      this.consultationMode === 'studio'
        ? 'In-Person Studio (Viman Nagar, Pune)'
        : 'Encrypted Online Video';

    // Block slot locally immediately to prevent double-booking
    this.markSlotBookedLocally(this.selectedDate, this.selectedSlot);

    // Block Leona's Google Calendar & trigger email notification via Google Apps Script Webhook
    if (this.calendarWebhookUrl) {
      try {
        const query = new URLSearchParams({
          action: 'createBooking',
          clientName: cleanName,
          phoneNumber: `+91 ${cleanPhone}`,
          clientEmail: cleanEmail,
          service: serviceLabel,
          durationMinutes: String(durationMinutes),
          mode: modeLabel,
          date: this.selectedDate,
          dayLabel: this.selectedDayLabel,
          slot: this.selectedSlot
        });

        const requestUrl = `${this.calendarWebhookUrl}?${query.toString()}`;
        await fetch(requestUrl, {
          method: 'GET',
          mode: 'no-cors'
        });
      } catch {
        // Proceed to confirmation screen even if network request encounters offline warning
      }
    }

    const summaryLines = [
      `Hi Leona (MindKatha), I would like to request a session slot:`,
      ``,
      `• Patient: ${cleanName}`,
      `• WhatsApp: +91 ${cleanPhone}`,
      ...(cleanEmail ? [`• Email: ${cleanEmail}`] : []),
      `• Care Pathway: ${serviceLabel}`,
      `• Format: ${modeLabel}`,
      `• Preferred Time: ${this.selectedDayLabel} at ${this.selectedSlot} IST`
    ].join('\n');

    this.whatsappConfirmationUrl = `https://wa.me/${this.practiceWhatsAppNumber}?text=${encodeURIComponent(summaryLines)}`;
    this.mailtoConfirmationUrl = `mailto:${this.practiceEmail}?subject=${encodeURIComponent(
      `MindKatha Consultation Request — ${cleanName} (${this.selectedDayLabel})`
    )}&body=${encodeURIComponent(summaryLines)}`;

    this.isSubmittingBooking = false;
    this.currentStep = 3;
  }

  sendBookingViaWhatsApp(): void {
    if (this.whatsappConfirmationUrl) {
      window.open(this.whatsappConfirmationUrl, '_blank', 'noopener,noreferrer');
    }
  }

  setStep(step: number): void {
    this.submitAttempted = false;
    this.currentStep = step;
  }
}
