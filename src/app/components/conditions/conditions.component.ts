import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective, CardSpotlightDirective } from '../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-conditions',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, CardSpotlightDirective],
  templateUrl: './conditions.component.html',
  styleUrl: './conditions.component.scss'
})
export class ConditionsComponent {
  expandedId: string | null = null;


  roadmapSteps = [
    {
      number: '01',
      phase: 'Initial Phase',
      title: 'Intake & Psychological Formulation',
      description: 'We map your life narrative, identify core somatic and emotional distress triggers, and co-create an individualized therapeutic roadmap.',
      modalities: ['Clinical Interview', 'Somatic Baseline', 'Goal Formulation']
    },
    {
      number: '02',
      phase: 'Regulation Phase',
      title: 'Nervous System Stabilization',
      description: 'Before diving into deep trauma, we establish physiological safety, grounding techniques, and de-escalation tools for anxiety and panic.',
      modalities: ['Somatic Experiencing', 'Vagal Regulation', 'Grounding Tools']
    },
    {
      number: '03',
      phase: 'Deep Work Phase',
      title: 'Cognitive & Narrative Restructuring',
      description: 'Challenging core shame beliefs, untangling unhelpful cognitive loops, processing past injuries, and re-authoring your life story.',
      modalities: ['CBT Framework', 'ACT Defusion', 'Narrative Therapy']
    },
    {
      number: '04',
      phase: 'Empowerment Phase',
      title: 'Consolidation & Relapse Prevention',
      description: 'Strengthening autonomous self-agency, setting firm relational boundaries, and equipping you to serve as your own lifelong mental coach.',
      modalities: ['Autonomous Agency', 'Relapse Blueprint', 'Lifelong Toolkit']
    }
  ];

  testimonials = [
    {
      name: 'Priya S.',
      role: 'Senior Product Manager • Pune',
      concern: 'Burnout & Panic Recovery',
      rating: 5,
      quote: 'Working with Leona helped me realize my burnout wasn’t personal weakness, but chronic nervous system depletion. Her blend of CBT and somatic exercises transformed how I handle work pressure and boundaries.'
    },
    {
      name: 'Rahul M.',
      role: 'Software Engineer • Telehealth Client',
      concern: 'Adult ADHD Evaluation',
      rating: 5,
      quote: 'The Adult ADHD assessment was the most validating clinical experience of my adult life. Leona provided rigorous diagnostic clarity and structured daily executive functioning tools that actually work.'
    },
    {
      name: 'A. & S.',
      role: 'Couples Consultation • In-Person Pune',
      concern: 'Relational Communication',
      rating: 5,
      quote: 'MindKatha offered a neutral, deeply safe space. Leona guided us out of toxic defensiveness and taught us attachment-informed communication habits that brought genuine closeness back.'
    }
  ];
}


