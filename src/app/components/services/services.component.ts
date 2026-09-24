import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective, CardSpotlightDirective } from '../../core/directives/scroll-reveal.directive';

export interface ClinicalServiceItem {
  id: string;
  category: 'individual' | 'diagnostics' | 'couples';
  title: string;
  modalityTag: string;
  description: string;
  image: string;
  duration: string;
  tags: string[];
  cadence: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, CardSpotlightDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  selectedTab: 'all' | 'individual' | 'diagnostics' | 'couples' = 'all';

  services: ClinicalServiceItem[] = [
    {
      id: 'individual-psychotherapy',
      category: 'individual',
      title: 'Individual Psychotherapy & Burnout Care',
      modalityTag: 'CBT • ACT • Somatic Experiencing',
      description: 'Weekly 1-on-1 sessions to unpack chronic exhaustion, anxiety loops, panic episodes, and imposter syndrome with gentle clinical guidance.',
      image: 'assets/images/sky_mindful_journaling.jpg',
      duration: '50 Mins',
      tags: ['Anxiety & Panic', 'Tech Burnout', 'Self-Agency'],
      cadence: 'Weekly / Bi-Weekly'
    },
    {
      id: 'psychometric-testing',
      category: 'diagnostics',
      title: 'Psychometric & Personality Testing',
      modalityTag: 'MCMI-IV • ROSHAK • TAT • WAIS',
      description: 'Standardized psychological test batteries for personality dynamics, clinical diagnosis, and cognitive evaluations with certified documentation.',
      image: 'assets/images/sky_psychometrics.jpg',
      duration: 'Standardized Battery',
      tags: ['MCMI-IV Profile', 'Projective Testing', 'Certified Report'],
      cadence: 'Formal Report in 3-5 Days'
    },
    {
      id: 'adult-adhd-assessment',
      category: 'diagnostics',
      title: 'Adult ADHD & Neurodivergent Navigation',
      modalityTag: 'Diagnostic Battery & Executive Coaching',
      description: 'Objective ADHD diagnostic evaluation paired with strengths-based coping strategies for task paralysis, time blindness, and masking fatigue.',
      image: 'assets/images/sky_adhd_focus.jpg',
      duration: 'Comprehensive Evaluation',
      tags: ['Task Paralysis', 'Executive Function', 'Neuro-Affirming'],
      cadence: 'Diagnostic Battery & Debrief'
    },
    {
      id: 'couples-mediation',
      category: 'couples',
      title: 'Couples & Relational Mediation',
      modalityTag: 'Gottman-Informed Framework',
      description: 'A neutral, confidential clinical space to untangle recurring arguments, repair attachment wounds, build empathy, and establish healthy relational boundaries.',
      image: 'assets/images/sky_couples_dialogue.jpg',
      duration: '60 Mins',
      tags: ['Communication Repair', 'Attachment Wounds', 'Pre-Marital Care'],
      cadence: 'Joint Consultation'
    }
  ];

  expandedCardIds = new Set<string>();

  get filteredServices(): ClinicalServiceItem[] {
    if (this.selectedTab === 'all') {
      return this.services;
    }
    return this.services.filter(s => s.category === this.selectedTab);
  }

  setTab(tab: 'all' | 'individual' | 'diagnostics' | 'couples') {
    this.selectedTab = tab;
  }

  isExpanded(id: string): boolean {
    return this.expandedCardIds.has(id);
  }

  toggleExpand(id: string) {
    if (this.expandedCardIds.has(id)) {
      this.expandedCardIds.delete(id);
    } else {
      this.expandedCardIds.add(id);
    }
  }
}
