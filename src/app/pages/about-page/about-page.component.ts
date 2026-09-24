import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {
  leonaPortraitUrl = 'assets/images/leona_portrait.png';

  quickFacts = [
    {
      icon: 'ph-graduation-cap',
      label: 'Qualification',
      value: 'M.Sc. Clinical Psychology & PDCP (RCI)'
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
      description: 'Thoughtfully integrating CBT, DBT, and Narrative Therapy into practical tools you can actually use.'
    },
    {
      icon: 'ph-sparkle',
      title: 'Neuro- & Queer-Affirming',
      description: 'A safe, de-pathologizing space tailored for adult ADHD, neurodivergence, and diverse identities.'
    },
    {
      icon: 'ph-heart',
      title: 'Warm & Non-Judgmental',
      description: 'No rigid formulas or clinical coldness—just honest, collaborative conversations at your own pace.'
    }
  ];
}
