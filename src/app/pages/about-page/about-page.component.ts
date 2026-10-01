import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, BreadcrumbComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {
  leonaPortraitUrl = 'assets/images/leona_portrait.webp';

  quickFacts = [
    {
      icon: 'ph-graduation-cap',
      label: 'Qualification',
      value: 'M.Sc. Clinical Psychology & PDCP (RCI #A84920)'
    },
    {
      icon: 'ph-translate',
      label: 'Languages',
      value: 'English, Hindi, Assamese & Bengali'
    },
    {
      icon: 'ph-map-pin',
      label: 'Consultations',
      value: 'Pune Studio (Viman Nagar) & Online Video'
    }
  ];

  approachPillars = [
    {
      icon: 'ph-compass',
      title: 'Evidence-Grounded Care',
      description: 'Integrating CBT, DBT, ACT, and Narrative Therapy into practical clinical tools you can apply in daily life.'
    },
    {
      icon: 'ph-sparkle',
      title: 'Neuro- & Queer-Affirming',
      description: 'A safe, de-pathologizing clinical space tailored for adult ADHD, neurodivergence, and LGBTQIA+ clients.'
    },
    {
      icon: 'ph-heart',
      title: 'Warm & Non-Judgmental',
      description: 'No rigid formulas or clinical detachment. Honest, collaborative conversations paced around your readiness.'
    }
  ];
}
