import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private bookingService: BookingService) {}

  openBooking() {
    this.bookingService.open();
  }
}
