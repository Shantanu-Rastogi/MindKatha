import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective, CardSpotlightDirective } from '../../core/directives/scroll-reveal.directive';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AuthorBioComponent } from '../../components/author-bio/author-bio.component';

export interface ServiceDetail {
  id: string;
  category: 'individual' | 'adhd' | 'couples' | 'diagnostics' | 'specializations';
  concernTag: 'burnout' | 'adhd' | 'relationships' | 'anxiety' | 'trauma' | 'queer' | 'diagnostics' | 'transitions';
  title: string;
  modality: string;
  description: string;
  extendedBrief?: string;
  image: string;
  imageAlt: string;
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
  imports: [CommonModule, RouterLink, ScrollRevealDirective, CardSpotlightDirective, BreadcrumbComponent, AuthorBioComponent],
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
      description: 'A structured, empathetic clinical space to work through chronic anxiety, panic episodes, mood fluctuations, and recurring thought loops using evidence-based psychological tools.',
      extendedBrief: 'Sessions begin with collaborative clinical goal-setting and emotional safety mapping. Rather than conversational venting alone, we integrate Cognitive Behavioral Therapy with nervous system grounding (including the physiological sigh and sensory orienting) so that psychological insights translate into lasting calm and practical coping strategies.',
      image: 'assets/images/sky_therapy_sanctuary.webp',
      imageAlt: 'Individual psychotherapy and emotional regulation consultation room at MindKatha Pune',
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
      description: 'Specialized clinical care for software engineers, product managers, founders, and corporate leaders managing chronic work exhaustion, imposter fatigue, and boundary loss.',
      extendedBrief: 'Addresses chronic stress overload caused by high-pressure corporate environments across Pune, Bengaluru, and remote teams. We examine the belief that self-worth depends solely on output, establish sustainable shutdown rituals, and restore healthy sleep patterns.',
      image: 'assets/images/sky_burnout_recovery.webp',
      imageAlt: 'Calm clinical workspace representing occupational burnout recovery and boundary restoration',
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
      description: 'A gently paced, safe clinical space to process developmental childhood trauma, emotional neglect, relational betrayal, and complex loss without re-traumatization.',
      extendedBrief: 'Trauma is often held physiologically in the nervous system as hyper-vigilance or emotional numbness. Using a phased recovery model (Stabilization, Processing, and Reintegration), we prioritize nervous system safety first so you can process painful experiences at a pace your body can safely tolerate.',
      image: 'assets/images/sky_trauma_healing.webp',
      imageAlt: 'Serene trauma-informed psychotherapy space with warm natural light at MindKatha',
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
      extendedBrief: 'Many adults spend years blaming themselves before recognizing underlying neurodivergence. Our diagnostic process includes the DIVA-5 clinical diagnostic interview, ASRS v1.1 symptom rating scales, executive functioning indices, and differential screening to distinguish ADHD from anxiety or trauma.',
      image: 'assets/images/sky_adhd_focus.webp',
      imageAlt: 'Structured clinical assessment materials for Adult ADHD diagnostic evaluation using DIVA-5',
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
      description: 'Practical, non-pathologizing therapy tailored for ADHD, AuDHD, and neurodivergent adults looking to unlearn masking shame and build low-friction daily routines.',
      extendedBrief: 'Standard productivity advice often increases shame in ADHD brains. We design dopamine-aligned workflows, externalize working memory with visual anchors, work through Rejection Sensitive Dysphoria (RSD), and build sensory-friendly routines that match your cognitive wiring.',
      image: 'assets/images/sky_neurodiversity.webp',
      imageAlt: 'Neurodivergent-affirming executive functioning and ADHD support session setup',
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
      description: 'A neutral, confidential clinical space to untangle recurring arguments, repair attachment injuries, reduce defensiveness, and rebuild emotional security.',
      extendedBrief: 'Recurring relationship conflicts often stem from attachment distress and emotional disconnection. We map the pursuer-distancer cycle without assigning blame, reduce criticism and stonewalling, and help partners express primary emotional needs clearly.',
      image: 'assets/images/sky_couples_dialogue.webp',
      imageAlt: 'Couples therapy and relational communication seating in the MindKatha Pune clinic',
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
      extendedBrief: 'Couples explore core life pillars in a structured setting: financial transparency, family-of-origin boundaries, division of domestic and emotional labor, intimacy expectations, and long-term goals.',
      image: 'assets/images/couple_care.webp',
      imageAlt: 'Pre-marital counseling and relational alignment consultation for couples',
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
      description: 'An affirming, confidential, and trauma-informed clinical space for queer, trans, non-binary, asexual, and questioning individuals and partners.',
      extendedBrief: 'We provide mental health care that never treats gender identity or sexual orientation as pathology. Sessions address minority stress, family boundaries, gender identity exploration, and queer relationship dynamics.',
      image: 'assets/images/sky_queer_affirming.webp',
      imageAlt: 'LGBTQIA+ and queer-affirmative psychotherapy safe space at MindKatha Pune',
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
      description: 'Objective, standardized clinical diagnostic batteries for personality profiling, diagnostic clarification, and cognitive evaluation with RCI-certified documentation.',
      extendedBrief: 'Uses validated psychometric instruments including MCMI-IV, MMPI-2, Beck Depression/Anxiety Inventories (BDI/BAI), and projective indices to clarify differential diagnoses. Includes a comprehensive clinical report and feedback session.',
      image: 'assets/images/sky_psychometrics.webp',
      imageAlt: 'Standardized psychometric and personality assessment battery (MCMI-IV, MMPI-2, WAIS-IV)',
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
      description: 'Psychological support for university students, young adults (18–26), and adolescents navigating identity questions, academic pressure, and early career transitions.',
      extendedBrief: 'We provide practical DBT distress tolerance skills, address academic performance anxiety and peer comparison, support healthy independence from family dynamics, and build emotional regulation.',
      image: 'assets/images/sky_narrative.webp',
      imageAlt: 'Young adult and college student counseling space at MindKatha',
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
      description: 'Gentle, structured psychological support through bereavement, disenfranchised grief, relationship endings, and major life transitions.',
      extendedBrief: 'Grief does not follow a linear timeline. Using the Dual Process Model, we honor both loss-oriented processing and gradual restoration of daily routines at your own pace.',
      image: 'assets/images/sky_mindful_journaling.webp',
      imageAlt: 'Quiet journaling and reflection corner for grief and bereavement counseling',
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
      description: 'Targeted clinical therapy for high-achievers experiencing harsh self-judgment, fear of failure, chronic people-pleasing, and conditional self-worth.',
      extendedBrief: 'Explores the developmental origins of a punitive inner critic. We build distress tolerance around imperfection, reduce people-pleasing habits, and strengthen self-worth independent of external validation.',
      image: 'assets/images/mindful_reflection.webp',
      imageAlt: 'Mindful reflection setting for perfectionism and self-worth psychotherapy',
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
    { id: 'discovery', label: 'Free Audio Discovery Call', icon: 'ph-phone-call' }
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
