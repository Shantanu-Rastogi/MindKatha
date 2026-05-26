import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { SpecializationsPageComponent } from './pages/specializations-page/specializations-page.component';
import { InsightsPageComponent } from './pages/insights-page/insights-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'services-page', component: ServicesPageComponent },
  { path: 'specializations', component: SpecializationsPageComponent },
  { path: 'insights', component: InsightsPageComponent },
  { path: 'book', component: BookingPageComponent }
];
