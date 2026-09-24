import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { AboutComponent } from '../../components/about/about.component';
import { ServicesComponent } from '../../components/services/services.component';
import { ConditionsComponent } from '../../components/conditions/conditions.component';
import { BookingDrawerComponent } from '../../components/booking-drawer/booking-drawer.component';
import { FaqContactComponent } from '../../core/layout/faq-contact/faq-contact.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ConditionsComponent,
    FaqContactComponent,
    BookingDrawerComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
