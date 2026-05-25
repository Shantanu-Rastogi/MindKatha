import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { AboutComponent } from '../../components/about/about.component';
import { ServicesComponent } from '../../components/services/services.component';
import { ConditionsComponent } from '../../components/conditions/conditions.component';
import { ClinicalComponent } from '../../components/clinical/clinical.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { ArticlesComponent } from '../../components/articles/articles.component';
import { BookingDrawerComponent } from '../../components/booking-drawer/booking-drawer.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    ConditionsComponent,
    ClinicalComponent,
    FaqComponent,
    ArticlesComponent,
    BookingDrawerComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
