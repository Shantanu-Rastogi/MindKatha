import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-booking-drawer',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './booking-drawer.component.html',
  styleUrl: './booking-drawer.component.scss'
})
export class BookingDrawerComponent {
  isOpen$ = this.bookingService.isOpen$;
  currentStep = 'mobile';

  constructor(private bookingService: BookingService) {}

  closeDrawer() {
    this.bookingService.close();
    this.currentStep = 'mobile';
  }

  proceedToOTP() {
    this.currentStep = 'otp';
  }

  verifyOTP() {
    this.currentStep = 'calendar';
  }

  goBack(step: string) {
    this.currentStep = step;
  }

  selectSlot(slot: string) {
    // Handle slot selection
  }

  proceedToPayment() {
    this.currentStep = 'pay';
  }

  completeCheckout() {
    this.currentStep = 'success';
  }
}
