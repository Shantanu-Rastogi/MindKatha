import { Injectable } from '@angular/core';
import { TherapyService, Modality, FAQItem, Specialization, Article } from '../models/therapy.model';

@Injectable({
  providedIn: 'root'
})
export class TherapyDataService {

  private services: TherapyService[] = [
    {
      title: 'Burnout & IT Stress',
      tag: 'Workplace Wellness',
      description: 'Specialized support for tech professionals navigating high-pressure environments, helping you restore your nervous system.',
      duration: '60 mins',
      iconClass: 'ph-lightning'
    },
    {
      title: 'Anxiety & Depression Management',
      tag: 'Clinical Care',
      description: 'Evidence-based care to help you navigate persistent worry and low mood, using warm and structured approaches.',
      duration: '60 mins',
      iconClass: 'ph-brain'
    },
    {
      title: 'Narrative Therapy',
      tag: 'Self Discovery',
      description: 'Helping you externalize problems and view them as separate from yourself, allowing you to write a new healing story.',
      duration: '60 mins',
      iconClass: 'ph-book-open'
    },
    {
      title: 'ADHD/Neurodivergence Support',
      tag: 'Neuro-Affirming',
      description: 'Affirming therapy to build personalized systems for executive functioning and navigate a world not built for your brain.',
      duration: '60 mins',
      iconClass: 'ph-sparkles'
    }
  ];

  private specializations: Specialization[] = [
    {
      title: 'Adult Psychotherapy & Burnout',
      detailedDescription: 'Addressing chronic workplace stress, emotional tracking, and anxiety scripts.',
      icon: 'ph-user-focus'
    },
    {
      title: 'Child & Adolescent Support',
      detailedDescription: 'Specializing in psychometric testing, behavioral modification, and developmental safe spaces.',
      icon: 'ph-baby'
    },
    {
      title: 'Trauma-Informed Frameworks',
      detailedDescription: 'Evidence-based approaches including EMDR, DBT, and somatic grounding.',
      icon: 'ph-shield'
    },
    {
      title: 'Queer-Affirmative Therapy',
      detailedDescription: 'Dedicated safe-harbor spaces for identity validation and relational healing.',
      icon: 'ph-rainbow'
    }
  ];

  private modalities: Modality[] = [
    {
      name: 'Narrative Therapy',
      description: 'Helping clients re-author their life stories by externalizing problems and focusing on unique outcomes and strengths.',
      iconClass: 'ph-book-open'
    },
    {
      name: 'Somatic Mindfulness',
      description: 'Integrating body awareness and mindfulness to calm the nervous system and process stored trauma or stress.',
      iconClass: 'ph-leaf'
    },
    {
      name: 'CBT',
      description: 'Identifying and modifying cognitive distortions and behavioral patterns to improve emotional regulation.',
      iconClass: 'ph-gear'
    },
    {
      name: 'Attachment Theory',
      description: 'Exploring relational patterns and attachment styles to foster secure, healthy relationships and communication.',
      iconClass: 'ph-users'
    }
  ];

  private faqs: FAQItem[] = [
    {
      question: 'What happens in the first intake session?',
      answer: 'The first session is an assessment. We understand your history, symptoms, and goals, and determine if we are the right therapeutic match for you. It\'s a two-way conversation.',
      category: 'Clarifications'
    },
    {
      question: 'Are sessions online or offline?',
      answer: 'Both! We offer online tele-therapy pan-India and physical sessions at our calm studio in the Baner-Pashan area, Pune.',
      category: 'Clarifications'
    },
    {
      question: 'How many sessions will I need?',
      answer: 'Therapy is subjective. Some find clarity in 6-8 sessions for specific goals, while others benefit from long-term self-exploration over several months. We work at your pace.',
      category: 'Clarifications'
    },
    {
      question: 'Is my data confidential?',
      answer: 'Absolutely. Confidentiality is the cornerstone of therapy. Details of your sessions remain private, except in rare contingencies where safety is at risk.',
      category: 'Clarifications'
    }
  ];

  private articles: Article[] = [
    {
      title: 'Navigating Burnout in High-Velocity Environments',
      excerpt: 'Strategies for recognizing chronic workplace stress, setting boundary scripts, and recovering cognitive energy.',
      readTime: '5 min read'
    },
    {
      title: 'The Neurobiology of Anxiety',
      excerpt: 'Understanding the brain\'s response to stress and how to rewire anxious patterns.',
      readTime: '7 min read'
    },
    {
      title: 'Re-authoring Your Identity Narrative',
      excerpt: 'Exploring how Narrative Therapy helps externalize problems and reclaim your personal story.',
      readTime: '6 min read'
    }
  ];

  getServices(): TherapyService[] {
    return this.services;
  }

  getSpecializations(): Specialization[] {
    return this.specializations;
  }

  getModalities(): Modality[] {
    return this.modalities;
  }

  getFAQs(): FAQItem[] {
    return this.faqs;
  }

  getArticles(): Article[] {
    return this.articles;
  }
}
