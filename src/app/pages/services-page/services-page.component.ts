import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective, CardSpotlightDirective } from '../../core/directives/scroll-reveal.directive';

export interface ServiceDetail {
  id: string;
  category: 'individual' | 'adhd' | 'couples' | 'diagnostics' | 'specializations';
  concernTag: 'burnout' | 'adhd' | 'relationships' | 'anxiety' | 'trauma' | 'queer' | 'diagnostics' | 'transitions';
  title: string;
  modality: string;
  description: string;
  extendedBrief?: string;
  image: string;
  duration: string;
  delivery: string;
  deliverables: string[];
  tags: string[];
}

export interface ScreenerOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  recommendedServiceId: string;
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, CardSpotlightDirective],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent {
  selectedCategory: 'all' | 'individual' | 'adhd' | 'couples' | 'diagnostics' | 'specializations' = 'all';
  selectedConcern: string = 'all';

  categories = [
    { id: 'all', label: 'All Services (12)' },
    { id: 'individual', label: '1-on-1 Psychotherapy' },
    { id: 'adhd', label: 'Adult ADHD & Neurodiversity' },
    { id: 'couples', label: 'Couples & Relational' },
    { id: 'diagnostics', label: 'Psychometric Testing' },
    { id: 'specializations', label: 'Specialized Care' }
  ];

  // 12 Comprehensive Services & Specializations (Multiple of 3: 4 full rows of 3)
  services: ServiceDetail[] = [
    {
      id: 'cbt-psychotherapy',
      category: 'individual',
      concernTag: 'anxiety',
      title: 'Individual Psychotherapy & Emotional Regulation',
      modality: 'CBT • Somatic Grounding • ACT (Acceptance & Commitment)',
      description: 'A structured, empathetic clinical space designed to unpack chronic anxiety, panic episodes, mood volatility, existential dread, and unhelpful thought loops with evidence-based psychological tools.',
      extendedBrief: 'Sessions begin with collaborative clinical goal-setting and emotional safety mapping. Rather than conversational venting alone, we integrate Cognitive Behavioral Therapy with nervous system grounding (including the physiological sigh and sensory orienting) so that psychological insights translate into lasting somatic calm and actionable coping strategies.',
      image: 'assets/images/sky_therapy_sanctuary.jpg',
      duration: '50 Minutes',
      delivery: 'In-Person Studio (Pune) & Telehealth',
      deliverables: ['Individualized Clinical Roadmap', 'Cognitive Restructuring Tools', 'Somatic Emergency Coping Toolkit', 'Audio Grounding Exercises'],
      tags: ['Anxiety & Panic', 'Depressive Episodes', 'Somatic Regulation', 'Emotional Flooding']
    },
    {
      id: 'burnout-restoration',
      category: 'individual',
      concernTag: 'burnout',
      title: 'Occupational Burnout & High-Performance Restoration',
      modality: 'Somatic Experiencing • Polyvagal Protocols • Boundary Restructuring',
      description: 'Specialized clinical care for software engineers, product managers, founders, and corporate leaders managing chronic work exhaustion, imposter fatigue, and boundary dissolution.',
      extendedBrief: 'Addresses allostatic overload caused by persistent high-pressure corporate environments across Pune, Bengaluru, and global remote setups. We dismantle the subconscious belief that self-worth is provisional on output, establish non-negotiable shutdown rituals, and restore fragmented sleep architecture.',
      image: 'assets/images/sky_burnout_recovery.jpg',
      duration: '50 Minutes',
      delivery: 'In-Person & Online Telehealth',
      deliverables: ['Allostatic Load Assessment', 'Work-Life Boundary Framework', 'Asynchronous Communication Protocol', 'Rest vs. Recovery Reset'],
      tags: ['Tech Burnout', 'Imposter Syndrome', 'Executive Fatigue', 'Work-Life Boundaries']
    },
    {
      id: 'trauma-informed-healing',
      category: 'individual',
      concernTag: 'trauma',
      title: 'Trauma-Informed Healing & Complex Grief Processing',
      modality: 'Somatic Experiencing • Attachment Reparenting • Narrative Care',
      description: 'A gently paced, safe clinical container to process developmental childhood trauma, emotional neglect, relational betrayal, and ambiguous loss without re-traumatization.',
      extendedBrief: 'Trauma is stored physiologically in the autonomic nervous system as hyper-vigilance or emotional numbness. Using a phased recovery model (Stabilization → Processing → Reintegration), we prioritize nervous system safety first, allowing you to untangle painful historical narratives at a pace your body can safely tolerate.',
      image: 'assets/images/sky_trauma_healing.jpg',
      duration: '50–60 Minutes',
      delivery: 'In-Person Studio (Viman Nagar) & Telehealth',
      deliverables: ['Somatic Safety Plan', 'Trigger Mapping & De-escalation Drill', 'Internal Resource Anchoring', 'Attachment Reparenting Blueprint'],
      tags: ['Complex PTSD', 'Ambiguous Loss', 'Childhood Attachment', 'Somatic Safety']
    },
    {
      id: 'adult-adhd-evaluation',
      category: 'adhd',
      concernTag: 'adhd',
      title: 'Comprehensive Adult ADHD Diagnostic Evaluation',
      modality: 'Gold-Standard Clinical Diagnostic Interview & Rating Batteries',
      description: 'Formal, multi-stage clinical diagnostic assessment for adult neurodivergence, attention regulation, task initiation paralysis, and executive dysfunction.',
      extendedBrief: 'Many adults spend decades internalizing moral self-blame before discovering their neurodivergence. Our diagnostic process includes the DIVA-5 clinical diagnostic interview, ASRS v1.1 symptom rating scales, executive functioning indices, and differential screening to distinguish ADHD from anxiety or trauma.',
      image: 'assets/images/sky_adhd_focus.jpg',
      duration: '2-Phase Evaluation',
      delivery: 'In-Person Studio & Supervised Virtual Battery',
      deliverables: ['Formal Psychologist-Signed Diagnostic Profile', 'Executive Function Scorecard', 'Workplace Accommodation Guidance', 'Post-Diagnostic Clinical Debrief'],
      tags: ['Adult ADHD Assessment', 'DIVA-5 Protocol', 'Executive Dysfunction', 'Task Paralysis']
    },
    {
      id: 'neurodivergent-scaffolding',
      category: 'adhd',
      concernTag: 'adhd',
      title: 'Neurodivergent Executive Functioning & De-Masking Support',
      modality: 'Neuro-Affirming Cognitive Scaffolding • Somatic Self-Compassion',
      description: 'Practical, non-pathologizing therapy tailored specifically for ADHD, AuDHD, and neurodivergent adults looking to unlearn toxic masking shame and build friction-free daily routines.',
      extendedBrief: 'Traditional neurotypical productivity hacks often exacerbate shame in ADHD brains. We design dopamine-aligned workflows, externalize working memory with visual anchors and body doubling, navigate Rejection Sensitive Dysphoria (RSD), and build sensory-friendly environments that honor your natural cognitive wiring.',
      image: 'assets/images/sky_neurodiversity.jpg',
      duration: '50 Minutes',
      delivery: 'In-Person & Online Telehealth',
      deliverables: ['Dopamine-Friendly Workflow Blueprint', 'RSD Emergency Protocol', 'Sensory Regulation Menu', 'Visual Scaffolding Templates'],
      tags: ['Neuro-Affirming', 'ADHD Masking', 'RSD Support', 'Executive Ease']
    },
    {
      id: 'couples-therapy',
      category: 'couples',
      concernTag: 'relationships',
      title: 'Couples & Relational Communication Mediation',
      modality: 'Gottman-Informed & Emotion-Focused Therapy (EFT)',
      description: 'A neutral, confidential clinical space to untangle recurring arguments, address attachment injuries, dismantle defensiveness, and restore mutual emotional security and intimacy.',
      extendedBrief: 'Most relationship fights are attachment protests against emotional disconnection. We map the pursuer-distancer cycle without assigning blame, de-escalate the Four Horsemen (criticism, contempt, defensiveness, stonewalling), and help partners express vulnerable primary emotions rather than reactive anger.',
      image: 'assets/images/sky_couples_dialogue.jpg',
      duration: '60–75 Minutes',
      delivery: 'In-Person (Pune) & Joint Virtual Telehealth',
      deliverables: ['Relational Conflict Cycle Map', 'Gottman De-escalation Protocol', 'Primary Emotion Expression Scripts', 'Weekly Repair Check-in Ritual'],
      tags: ['Anxious-Avoidant Dance', 'Communication Breakdown', 'Attachment Repair', 'Relational Safety']
    },
    {
      id: 'pre-marital-alignment',
      category: 'couples',
      concernTag: 'relationships',
      title: 'Pre-Marital Alignment & Relational Readiness',
      modality: 'Preventative Systemic & Values-Clarification Counseling',
      description: 'Proactive, structured consultation for couples planning marriage or long-term partnership to align expectations, family dynamics, finances, and conflict styles.',
      extendedBrief: 'Couples explore core life pillars in a structured, guided setting: financial transparency and philosophy, family of origin boundaries, emotional division of labor, intimacy expectations, and shared existential visions. Equips couples with preventative communication tools for long-term relational resilience.',
      image: 'assets/images/couple_care.jpg',
      duration: '4-Session Structured Track',
      delivery: 'In-Person & Online Telehealth',
      deliverables: ['Pre-Marital Values Alignment Map', 'Family Boundary Blueprint', 'Financial Communication Framework', 'Relational Health Checklist'],
      tags: ['Pre-Marital Counseling', 'Marriage Readiness', 'Family Boundaries', 'Values Alignment']
    },
    {
      id: 'queer-affirmative-care',
      category: 'specializations',
      concernTag: 'queer',
      title: 'Queer, Trans & LGBTQIA+ Affirmative Psychotherapy',
      modality: 'Identity-Affirmative & Narrative Empowerment Therapy',
      description: 'An unequivocally safe, celebratory, and trauma-informed clinical space for queer, trans, non-binary, asexual, and questioning individuals and relationships.',
      extendedBrief: 'We provide mental health care that never treats gender or sexual orientation as a pathology. We explore minority stress, navigating family coming-out dynamics, gender euphoria, transition-related emotional processing, queer relational formats, and boundary setting with unsupportive environments.',
      image: 'assets/images/sky_queer_affirming.jpg',
      duration: '50 Minutes',
      delivery: 'In-Person Studio & Telehealth',
      deliverables: ['Minority Stress Resilience Toolkit', 'Affirming Identity Narrative', 'Relational Boundary Blueprint', 'Transition Support Scaffolding'],
      tags: ['LGBTQIA+ Affirmative', 'Queer Mental Health', 'Gender Euphoria', 'Minority Stress']
    },
    {
      id: 'psychometric-testing-battery',
      category: 'diagnostics',
      concernTag: 'diagnostics',
      title: 'Standardized Psychometric & Personality Assessment',
      modality: 'MCMI-IV • MMPI-2 • Projective Batteries • Standardized Inventories',
      description: 'Objective, standardized clinical diagnostic batteries for personality profiling, emotional structure, psychiatric clarification, and cognitive abilities with certified clinical documentation.',
      extendedBrief: 'Utilizes validated psychometric instruments including MCMI-IV, MMPI-2, Beck Depression/Anxiety Inventories (BDI/BAI), and projective indices to evaluate differential diagnoses. Administered under strict ethical guidelines with a comprehensive clinical report detailing diagnostic conclusions and evidence-based treatment recommendations.',
      image: 'assets/images/sky_psychometrics.jpg',
      duration: 'Multi-Phase Testing (3–5 Days for Report)',
      delivery: 'Supervised Clinical Setting & Secure Digital Battery',
      deliverables: ['Official Psychologist-Signed Diagnostic Dossier', 'Quantitative Severity Profiling', 'Psychiatric & Therapeutic Treatment Recommendations', '1-on-1 Feedback Session'],
      tags: ['MCMI-IV Testing', 'Projective Assessment', 'RCI Certified Report', 'Differential Diagnosis']
    },
    {
      id: 'adolescent-emerging-adulthood',
      category: 'specializations',
      concernTag: 'transitions',
      title: 'Adolescent, College & Emerging Adulthood Mentorship',
      modality: 'Developmental Narrative & Dialectical Behavior Therapy (DBT)',
      description: 'Specialized psychological support for university students, young adults (18–26), and adolescents navigating identity confusion, academic pressure, and independence.',
      extendedBrief: 'Emerging adulthood is one of the most volatile developmental stages. We provide concrete DBT distress tolerance skills, navigate academic performance anxiety and competitive comparison, support individuation from family dynamics, and foster grounded emotional regulation and career confidence.',
      image: 'assets/images/sky_narrative.jpg',
      duration: '50 Minutes',
      delivery: 'In-Person (Pune) & Telehealth',
      deliverables: ['DBT Distress Tolerance Toolkit', 'Academic Anxiety Management Guide', 'Identity Value Compass', 'Parent-Young Adult Communication Guide'],
      tags: ['Student Mental Health', 'College Transitions', 'Emerging Adulthood', 'DBT Skills']
    },
    {
      id: 'grief-bereavement-transitions',
      category: 'specializations',
      concernTag: 'trauma',
      title: 'Grief, Bereavement & Life Transition Counseling',
      modality: 'Compassion-Focused Therapy • Meaning Reconstruction • Dual Process Model',
      description: 'Gentle, structured psychological accompaniment through profound bereavement, disenfranchised grief, unexpected life disruptions, and non-finite loss.',
      extendedBrief: 'Grief is not a linear checklist. Using Stroebe & Schut’s Dual Process Model, we build a safe space that honors both loss-oriented processing (crying, remembrance, feeling the weight) and restoration-oriented adjustment (rebuilding daily life rhythms without guilt or disloyalty to the past).',
      image: 'assets/images/sky_mindful_journaling.jpg',
      duration: '50 Minutes',
      delivery: 'In-Person (Pune) & Telehealth',
      deliverables: ['Grief & Loss Journaling Scaffolding', 'Somatic Wave Regulation Exercises', 'Meaning-Making Blueprint', 'Anniversary Distress Protocol'],
      tags: ['Grief & Bereavement', 'Disenfranchised Grief', 'Life Transitions', 'Compassion Care']
    },
    {
      id: 'perfectionism-self-worth',
      category: 'specializations',
      concernTag: 'burnout',
      title: 'Perfectionism, Self-Worth & Inner Critic Restructuring',
      modality: 'Schema Therapy Insights • Compassion-Focused Therapy (CFT) • Narrative Care',
      description: 'Targeted clinical therapy for conscientious over-achievers trapped in harsh self-judgment, fear of failure, people-pleasing, and conditional self-worth.',
      extendedBrief: 'Unpacks the developmental roots of the internalized harsh critic. We externalize the demanding perfectionist voice, build somatic distress tolerance for "good enough" outcomes, dismantle chronic people-pleasing loops, and cultivate unconditional self-worth independent of external validation or productivity.',
      image: 'assets/images/mindful_reflection.jpg',
      duration: '50 Minutes',
      delivery: 'In-Person (Pune) & Telehealth',
      deliverables: ['Inner Critic Externalization Exercises', 'Self-Compassion Somatic Anchors', 'Boundary Scripting Guide', 'Core Values Compass'],
      tags: ['Chronic Perfectionism', 'Self-Esteem', 'Inner Critic', 'People-Pleasing']
    }
  ];

  expandedServiceIds = new Set<string>();

  // Interactive Clinical Screener State (Feature 1)
  screenerStep: number = 1; // 1 = Select Concern, 2 = Select Format, 3 = Recommendation Result
  selectedScreenerConcern: string = '';
  selectedScreenerFormat: string = '';
  matchedService: ServiceDetail | null = null;

  screenerConcerns: ScreenerOption[] = [
    {
      id: 'burnout',
      title: 'Workplace Burnout & Imposter Exhaustion',
      subtitle: 'Constantly exhausted, high work stress, inability to disconnect from work',
      icon: 'ph-fire',
      recommendedServiceId: 'burnout-restoration'
    },
    {
      id: 'adhd',
      title: 'Task Paralysis & Suspected Adult ADHD',
      subtitle: 'Chronic procrastination, time blindness, sensory overload, unlearning masking shame',
      icon: 'ph-sparkle',
      recommendedServiceId: 'adult-adhd-evaluation'
    },
    {
      id: 'anxiety',
      title: 'Panic Episodes & Somatic Overwhelm',
      subtitle: 'Racing heart, catastrophic thinking, nervous system flooding, chest tightness',
      icon: 'ph-wind',
      recommendedServiceId: 'cbt-psychotherapy'
    },
    {
      id: 'relationships',
      title: 'Relationship & Couples Conflict',
      subtitle: 'Recurring arguments, pursuer-distancer disconnect, attachment insecurities',
      icon: 'ph-heart-break',
      recommendedServiceId: 'couples-therapy'
    },
    {
      id: 'trauma',
      title: 'Trauma, Grief & Childhood Wounds',
      subtitle: 'Processing developmental memories, ambiguous loss, or emotional neglect',
      icon: 'ph-shield-check',
      recommendedServiceId: 'trauma-informed-healing'
    },
    {
      id: 'queer',
      title: 'Queer & LGBTQIA+ Affirmative Space',
      subtitle: 'Minority stress, gender identity, coming out dynamics, celebratory support',
      icon: 'ph-rainbow',
      recommendedServiceId: 'queer-affirmative-care'
    }
  ];

  screenerFormats = [
    { id: 'in-person', label: 'In-Person Studio (Viman Nagar, Pune)', icon: 'ph-map-pin' },
    { id: 'telehealth', label: 'Encrypted Online Telehealth Video', icon: 'ph-video-camera' },
    { id: 'discovery', label: 'Free 15-Minute Audio Discovery Call', icon: 'ph-phone-call' }
  ];

  get filteredServices(): ServiceDetail[] {
    if (this.selectedCategory === 'all') {
      return this.services;
    }
    return this.services.filter(s => s.category === this.selectedCategory);
  }

  setCategory(cat: string) {
    this.selectedCategory = cat as any;
  }

  isExpanded(id: string): boolean {
    return this.expandedServiceIds.has(id);
  }

  toggleExpand(id: string) {
    if (this.expandedServiceIds.has(id)) {
      this.expandedServiceIds.delete(id);
    } else {
      this.expandedServiceIds.add(id);
    }
  }

  // Screener Actions
  selectScreenerConcern(opt: ScreenerOption) {
    this.selectedScreenerConcern = opt.id;
    this.matchedService = this.services.find(s => s.id === opt.recommendedServiceId) || this.services[0];
    this.screenerStep = 2;
  }

  selectScreenerFormat(formatId: string) {
    this.selectedScreenerFormat = formatId;
    this.screenerStep = 3;
  }

  resetScreener() {
    this.screenerStep = 1;
    this.selectedScreenerConcern = '';
    this.selectedScreenerFormat = '';
    this.matchedService = null;
  }
}
