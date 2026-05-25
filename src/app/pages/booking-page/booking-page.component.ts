import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent {
  currentStep = 1;
  selectedSlot: string | null = null;

  setStep(step: number) {
    this.currentStep = step;
  }

  selectSlot(slot: string) {
    this.selectedSlot = slot;
  }
}
