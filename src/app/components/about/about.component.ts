import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective, CardSpotlightDirective } from '../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, CardSpotlightDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;
  private hasAnimated = false;

  displayYears = 0;
  displaySessions = 0;

  // Interactive Self-Reflection Screener State (CoachForMind / SafeStories inspired)
  selectedConcern: string = 'burnout';
  
  concernsList = [
    { 
      id: 'burnout', 
      label: 'Burnout & Executive Exhaustion', 
      icon: 'ph-battery-warning', 
      recommendation: 'Occupational Burnout & Somatic Regulation (50 min)', 
      description: 'Targeting autonomic nervous system depletion, imposter syndrome, and boundary rebuilding for tech & high-output professionals.', 
      tags: ['Somatic Care', 'Boundary Protocols', 'Tech Fatigue']
    },
    { 
      id: 'anxiety', 
      label: 'Overthinking & Anxiety Spirals', 
      icon: 'ph-arrows-clockwise', 
      recommendation: 'Individual CBT & Nervous System De-escalation (50 min)', 
      description: 'Evidence-based cognitive restructuring paired with physiological grounding to calm panic and persistent anticipatory dread.', 
      tags: ['CBT Protocol', 'Somatic Grounding', 'Panic De-escalation']
    },
    { 
      id: 'adhd', 
      label: 'Task Paralysis & Adult ADHD', 
      icon: 'ph-lightning', 
      recommendation: 'Standardized Adult ADHD Clinical Evaluation', 
      description: 'Formal psychometric testing, executive dysfunction mapping, and structured coping strategies for neurodivergent adults.', 
      tags: ['Diagnostic Battery', 'Executive Support', 'ADHD Screening']
    },
    { 
      id: 'relationship', 
      label: 'Relational Friction & Boundary Guilt', 
      icon: 'ph-heart-break', 
      recommendation: 'Couples & Relational Mediation (60 min)', 
      description: 'Attachment-informed communication frameworks to resolve recurring conflict cycles, emotional detachment, and codependency.', 
      tags: ['Gottman-Informed', 'Attachment Repair', 'Conflict De-escalation']
    },
    { 
      id: 'assessment', 
      label: 'Psychometric & Personality Testing', 
      icon: 'ph-brain', 
      recommendation: 'Clinical Diagnostic Battery (MCMI-IV, ROSHAK, TAT, WAIS)', 
      description: 'Objective, standardized psychometric profiling for clinical diagnosis, psychiatric collaboration, or legal/academic evaluations.', 
      tags: ['MCMI-IV', 'ROSHAK Projective', 'WAIS Cognitive', 'RCI Certified']
    }
  ];

  get activeRecommendation() {
    return this.concernsList.find(c => c.id === this.selectedConcern) || this.concernsList[0];
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateCounters();
          }
        });
      }, { threshold: 0.15 });

      this.observer.observe(this.el.nativeElement);
    } else {
      this.displayYears = 5;
      this.displaySessions = 7000;
    }
  }

  animateCounters() {
    const duration = 1600; // ms
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      this.displayYears = Math.floor(easeOut * 5);
      this.displaySessions = Math.floor(easeOut * 7000);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        this.displayYears = 5;
        this.displaySessions = 7000;
      }
    };

    requestAnimationFrame(update);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

