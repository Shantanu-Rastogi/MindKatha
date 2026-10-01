import { Routes } from '@angular/router';
import { HomeDemoPageComponent } from './pages/home-demo-page/home-demo-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeDemoPageComponent,
    title: 'MindKatha (mindkatha.in) | Clinical Psychotherapy & Adult ADHD Diagnostics in Pune'
  },
  { path: 'home-demo', redirectTo: '', pathMatch: 'full' },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about-page/about-page.component').then((m) => m.AboutPageComponent),
    title: 'Leona Lahkar — RCI Licensed Clinical Psychologist (#A84920) | MindKatha'
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services-page/services-page.component').then((m) => m.ServicesPageComponent),
    title: 'Therapy Services, Adult ADHD & Psychometric Testing | MindKatha Pune'
  },
  { path: 'services-page', redirectTo: 'services', pathMatch: 'full' },
  { path: 'specializations', redirectTo: 'services', pathMatch: 'full' },
  { path: 'insights', redirectTo: 'services', pathMatch: 'full' },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent),
    title: 'Contact Viman Nagar Studio & Clinical FAQs | MindKatha Pune'
  },
  {
    path: 'book',
    loadComponent: () =>
      import('./pages/booking-page/booking-page.component').then((m) => m.BookingPageComponent),
    title: 'Book a Therapy Session or Free Discovery Call | MindKatha Pune'
  },
  {
    path: 'legal',
    loadComponent: () =>
      import('./pages/legal-page/legal-page.component').then((m) => m.LegalPageComponent),
    title: 'Legal, Privacy Policy & Clinical Informed Consent | MindKatha'
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/legal-page/legal-page.component').then((m) => m.LegalPageComponent),
    title: 'Privacy Policy & DPDP Act 2023 Compliance | MindKatha'
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/legal-page/legal-page.component').then((m) => m.LegalPageComponent),
    title: 'Terms of Service & Cancellation Policy | MindKatha'
  },
  {
    path: 'consent',
    loadComponent: () =>
      import('./pages/legal-page/legal-page.component').then((m) => m.LegalPageComponent),
    title: 'Clinical Informed Consent & Ethical Scope | MindKatha'
  },
  { path: '**', redirectTo: '' }
];
