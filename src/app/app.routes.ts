import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { BookingPageComponent } from './pages/booking-page/booking-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { LegalPageComponent } from './pages/legal-page/legal-page.component';
import { HomeDemoPageComponent } from './pages/home-demo-page/home-demo-page.component';
import { LogoLabPageComponent } from './pages/logo-lab-page/logo-lab-page.component';

export const routes: Routes = [
  { path: '', component: HomeDemoPageComponent },
  { path: 'home-demo', component: HomeDemoPageComponent },
  { path: 'logo-lab', component: LogoLabPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'services-page', redirectTo: 'services', pathMatch: 'full' },
  { path: 'specializations', redirectTo: 'services', pathMatch: 'full' },
  { path: 'insights', redirectTo: 'services', pathMatch: 'full' },
  { path: 'contact', component: ContactPageComponent },
  { path: 'book', component: BookingPageComponent },
  { path: 'legal', component: LegalPageComponent },
  { path: 'privacy', component: LegalPageComponent },
  { path: 'terms', component: LegalPageComponent },
  { path: 'consent', component: LegalPageComponent },
  { path: '**', redirectTo: '' }
];
