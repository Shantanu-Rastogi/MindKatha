import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  NgZone,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingDrawerComponent } from '../../components/booking-drawer/booking-drawer.component';
interface ValuePropSlide {
  id: string;
  category: string;
  shortTag: string;
  headline: string;
  headlineAccent: string;
  description: string;
  image: string;
  badge: string;
  protocolBadge: string;
  ctaLabel: string;
  serviceBookingName: string;
  deliverables: { icon: string; title: string; desc: string }[];
  metrics: { label: string; value: string }[];
}

interface ThreeUpFeature {
  title: string;
  category: string;
  durationBadge: string;
  cadenceBadge: string;
  image: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  serviceBookingName: string;
}

interface CareProcessStep {
  stepNum: string;
  duration: string;
  title: string;
  description: string;
  outcomeTag: string;
  icon: string;
}

interface ClinicalFaqItem {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-home-demo-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BookingDrawerComponent],
  templateUrl: './home-demo-page.component.html',
  styleUrl: './home-demo-page.component.scss'
})
export class HomeDemoPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private bookingService = inject(BookingService);

  isBrowser = false;
  activeSlideIndex = 0;
  slideProgress = 0;
  activeFaqIndex: number | null = 0;

  private observer: IntersectionObserver | null = null;
  private scrollRafId: number | null = null;
  private prefersReducedMotion = false;

  // Hero: Google Health v2 "HomeValueProps" pinned slider (3 slides across 3 core clinical pillars)
  private heroIntroTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  loadAnimationComplete = false;

  private hvpSection: HTMLElement | null = null;
  private hvpTrack: HTMLElement | null = null;
  private hvpSticky: HTMLElement | null = null;
  private hvpSlides: HTMLElement[] = [];
  private hvpMedia: Array<HTMLElement | null> = [];
  private hvpRevealed: boolean[] = [];
  private hvpSlideY: number[] = [];
  private hvpMediaY: number[] = [];
  private hvpHeight = 0;
  private hvpTrackTop = 0;
  private hvpProgress = 0;
  private hvpStatic = false;
  private lastInputWasKeyboard = false;
  private progressBarEl: HTMLElement | null = null;
  private valuePropsTrackEl: HTMLElement | null = null;
  private readonly teardownFns: Array<() => void> = [];

  // Stat Counter states
  statsAnimated = false;
  statHours = 1200;
  statRating = 100;
  statMinutes = 15;

  // 3-Step Clinical Care Journey
  readonly careSteps: CareProcessStep[] = [
    {
      stepNum: '01',
      duration: 'Complimentary • Zero Pressure',
      title: 'Free Discovery Call',
      description:
        'A zero-pressure phone or audio conversation to share what brings you to therapy, ask questions about our approach, and ensure mutual comfort before booking.',
      outcomeTag: 'Clarity & Fit Match',
      icon: 'ph-phone-call'
    },
    {
      stepNum: '02',
      duration: '60 Mins • First Session',
      title: 'Collaborative Clinical Intake',
      description:
        'We gently map your lived history, current nervous system stressors, and personal goals—establishing a tailored therapeutic or diagnostic plan at a pace that feels safe.',
      outcomeTag: 'Personalized Care Plan',
      icon: 'ph-compass'
    },
    {
      stepNum: '03',
      duration: '50 Mins • Weekly / Bi-Weekly',
      title: 'Ongoing Dialogue & Integration',
      description:
        'Consistent 1-on-1 sessions in our Viman Nagar studio or encrypted telehealth, combining evidence-based psychotherapy with practical between-session somatic grounding.',
      outcomeTag: 'Sustainable Regulation',
      icon: 'ph-plant'
    }
  ];

  // Value Props clinical pathways (Each with unique CTA label & pre-filled booking service)
  readonly valuePropsSlides: ValuePropSlide[] = [
    {
      id: 'untangle',
      category: 'Adult ADHD & Neurodivergence',
      shortTag: 'CLINICAL PATHWAY 01',
      headline: 'Untangle executive dysfunction with',
      headlineAccent: 'clinical diagnostic clarity.',
      description:
        'Many intelligent adults spend decades mistaking neurobiological executive dysfunction for personal failure or laziness. We conduct structured, gold-standard evaluations and build low-friction, dopamine-friendly scaffolding without forcing neurotypical masking.',
      image: 'assets/images/sky_adhd_focus.jpg',
      badge: 'DIVA-5 & WAIS-IV Protocol',
      protocolBadge: 'RCI Certified Evaluation • Accommodations Ready',
      ctaLabel: 'Request ADHD Diagnostic Battery',
      serviceBookingName: 'Comprehensive Adult ADHD Diagnostic Evaluation',
      deliverables: [
        {
          icon: 'ph-brain',
          title: 'DIVA-5 & WAIS-IV Clinical Battery',
          desc: 'Multi-stage assessment evaluating attention regulation, working memory, task initiation, and processing speed.'
        },
        {
          icon: 'ph-file-text',
          title: 'Signed Clinical Diagnostic Dossier',
          desc: 'Comprehensive psychometric report suitable for university/workplace accommodations and psychiatric collaboration.'
        },
        {
          icon: 'ph-sparkle',
          title: 'De-Masking & Executive Scaffolding',
          desc: 'Practical workflows for time blindness, sensory overload, and Rejection Sensitive Dysphoria (RSD).'
        }
      ],
      metrics: [
        { label: 'Evaluation Method', value: 'Semi-Structured Clinical' },
        { label: 'Documentation', value: 'Formal Accommodation Ready' },
        { label: 'Care Model', value: 'Neurodiversity-Affirming' }
      ]
    },
    {
      id: 'somatic',
      category: 'Trauma & Somatic Healing',
      shortTag: 'CLINICAL PATHWAY 02',
      headline: 'Regulate your nervous system.',
      headlineAccent: 'Heal beyond just the words.',
      description:
        'When the body remains trapped in chronic fight, flight, or freeze, purely logical advice falls short. We pair bottom-up polyvagal regulation with narrative and attachment therapy to gently release developmental wounds and chronic hyper-vigilance.',
      image: 'assets/images/sky_trauma_healing.jpg',
      badge: 'Polyvagal & Somatic Modalities',
      protocolBadge: 'Autonomic Regulation • Safe Pacing Protocol',
      ctaLabel: 'Begin Somatic Trauma Therapy',
      serviceBookingName: 'Trauma-Informed Healing & Complex Grief Processing (50 mins)',
      deliverables: [
        {
          icon: 'ph-heartbeat',
          title: 'Autonomic Nervous System Stabilization',
          desc: 'Physiological grounding protocols to widen your window of tolerance and disarm acute panic spikes.'
        },
        {
          icon: 'ph-shield-check',
          title: 'Titrated Trauma Processing',
          desc: 'Carefully paced exploration of attachment injuries, complex grief, and childhood emotional neglect without overwhelm.'
        },
        {
          icon: 'ph-book-open-text',
          title: 'Narrative Re-Authoring',
          desc: 'Externalizing internalized shame scripts so you can reclaim agency over your identity and relationships.'
        }
      ],
      metrics: [
        { label: 'Nervous System Focus', value: 'Vagal & Somatic Reset' },
        { label: 'Environment', value: 'Zero-Judgment Sanctuary' },
        { label: 'Modality', value: 'In-Studio & Encrypted Video' }
      ]
    },
    {
      id: 'focus',
      category: 'Executive Burnout & Vitality',
      shortTag: 'CLINICAL PATHWAY 03',
      headline: 'Rebuild cognitive vitality',
      headlineAccent: 'without sacrificing ambition.',
      description:
        'Designed for software engineers, founders, clinicians, and leaders navigating allostatic overload and imposter fatigue. We help you decouple your human worth from sprint velocity and build sustainable psychological boundaries.',
      image: 'assets/images/sky_burnout_recovery.jpg',
      badge: 'Occupational Restoration',
      protocolBadge: 'High-Velocity Professional Care • Confidential',
      ctaLabel: 'Book Burnout Recovery Intake',
      serviceBookingName: 'Occupational Burnout & High-Performance Restoration (50 mins)',
      deliverables: [
        {
          icon: 'ph-compass',
          title: 'Dismantling Imposter Fatigue',
          desc: 'Schema and ACT interventions to quiet relentless self-criticism, over-functioning, and people-pleasing loops.'
        },
        {
          icon: 'ph-battery-charging',
          title: 'Allostatic Load & Sleep Recovery',
          desc: 'Active physiological down-regulation rituals that restore deep cognitive focus and emotional bandwidth.'
        },
        {
          icon: 'ph-sliders-horizontal',
          title: 'Guilt-Free Boundary Architecture',
          desc: 'Concrete communication scripts to protect personal recovery hours in high-demand work cultures.'
        }
      ],
      metrics: [
        { label: 'Cognitive Recovery', value: 'Evidence-Based Pacing' },
        { label: 'Target Audience', value: 'Engineers, Founders & Leaders' },
        { label: 'Outcome', value: 'Sustainable Executive Energy' }
      ]
    }
  ];

  // 3-Up Session Formats (Transparent structure, duration & cadence)
  readonly featureCards: ThreeUpFeature[] = [
    {
      title: '1-on-1 Individual Psychotherapy',
      category: 'Ongoing Clinical Care',
      durationBadge: '50 Mins / Session',
      cadenceBadge: 'Weekly or Bi-Weekly',
      image: 'assets/images/therapy_dialogue.jpg',
      description:
        'Dedicated one-on-one therapeutic space integrating CBT, ACT, Narrative Therapy, and somatic mindfulness for anxiety, mood shifts, grief, and life transitions.',
      bullets: [
        'Conducted in English, Hindi, Assamese, or Bengali',
        'Available at our Viman Nagar studio or encrypted video',
        'Collaborative goal reviews every 4–6 sessions'
      ],
      ctaLabel: 'Book Individual Session',
      serviceBookingName: 'Individual Psychotherapy & Emotional Regulation (50 mins)'
    },
    {
      title: 'Psychometric & ADHD Evaluations',
      category: 'Diagnostic Batteries',
      durationBadge: '2-Phase Battery',
      cadenceBadge: 'Includes Written Dossier',
      image: 'assets/images/sky_psychometrics.jpg',
      description:
        'Standardized clinical assessments (DIVA-5, WAIS-IV, MCMI-IV, Rorschach & TAT) for adult ADHD, personality profiling, and differential diagnosis.',
      bullets: [
        'Structured clinical interviews & standardized testing',
        'Signed RCI-registered diagnostic report & debrief',
        'Actionable accommodations & psychiatrist coordination'
      ],
      ctaLabel: 'Schedule Diagnostic Assessment',
      serviceBookingName: 'Comprehensive Adult ADHD Diagnostic Evaluation'
    },
    {
      title: 'Couples & Relational Mediation',
      category: 'Partner & Pre-Marital Care',
      durationBadge: '60–75 Mins / Session',
      cadenceBadge: 'Joint & Individual Slots',
      image: 'assets/images/sky_couples_dialogue.jpg',
      description:
        'Emotionally Focused Therapy (EFT) and Gottman-informed mediation to de-escalate reactive conflict cycles, heal attachment ruptures, and build secure intimacy.',
      bullets: [
        'Neutral, non-blaming clinical facilitation',
        'Deconstructs anxious-avoidant communication loops',
        'Structured 4-session Pre-Marital Alignment track available'
      ],
      ctaLabel: 'Book Couples Consultation',
      serviceBookingName: 'Couples & Relational Communication Mediation (60 mins)'
    }
  ];

  // Top 5 High-Trust Clinical FAQs
  readonly clinicalFaqs: ClinicalFaqItem[] = [
    {
      question: 'What happens during the first 60-minute intake session?',
      answer:
        'Your first session is a collaborative, unhurried conversation—never an interrogation. Together with Leona Lahkar (RCI-licensed Clinical Psychologist), you will explore what brings you in, discuss relevant personal and medical history, identify immediate stressors, and co-create a comfortable clinical roadmap.',
      category: 'First Steps'
    },
    {
      question: 'How does the Adult ADHD diagnostic evaluation work?',
      answer:
        'Our Adult ADHD assessment is conducted across two structured phases using gold-standard clinical tools (including DIVA-5 and cognitive/executive batteries). We evaluate childhood and adult symptom presentation, screen for overlapping conditions like anxiety or burnout, and provide a signed clinical dossier along with a personalized debriefing session.',
      category: 'Diagnostics'
    },
    {
      question: 'Can I switch between in-person studio sessions in Pune and online telehealth?',
      answer:
        'Yes, seamlessly. Many clients in Pune attend key sessions in person at our Disha Eternia studio in Viman Nagar and switch to encrypted video telehealth during busy workweeks or travel. We also serve clients across Mumbai, Bengaluru, and international time zones.',
      category: 'Flexibility'
    },
    {
      question: 'Is everything I share strictly confidential?',
      answer:
        'Absolutely. MindKatha adheres strictly to Rehabilitation Council of India (RCI) clinical ethics. Your attendance, clinical notes, and diagnostic findings are never shared with employers, family members, or third parties without your explicit written consent, except in legally mandated situations of imminent physical harm.',
      category: 'Privacy & Ethics'
    },
    {
      question: 'Do you prescribe psychiatric medication?',
      answer:
        'As a clinical psychology practice, our focus is evidence-based psychotherapy, somatic regulation, and standardized diagnostic testing. When medication evaluation is clinically beneficial, we collaborate closely with trusted, neuro-affirming psychiatrists in Pune and Mumbai.',
      category: 'Scope of Care'
    }
  ];

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const root: HTMLElement = this.el.nativeElement;
    this.progressBarEl = root.querySelector('.js-scroll-progress-bar');
    this.valuePropsTrackEl = root.querySelector('.js-value-props-track');

    this.initHeroSlider();
    this.playHeroLoadAnimation();
    this.setupIntersectionObserver();
    this.setupScrollListener();

    // ?scroll=<px> (deterministic QA screenshots), URL hash or ?section= deep links
    const params = new URLSearchParams(window.location.search);
    const scrollParam = params.get('scroll');
    if (scrollParam !== null && scrollParam.trim() !== '' && Number.isFinite(Number(scrollParam))) {
      const targetY = Math.max(0, Number(scrollParam));
      const applyScroll = () => {
        this.jumpTo(targetY);
        this.loadAnimationComplete = true;
        this.handleScrollCalculations();
      };
      applyScroll();
      requestAnimationFrame(applyScroll);
      setTimeout(applyScroll, 80);
    }
    const targetId = window.location.hash.replace('#', '') || params.get('section');
    if (targetId) {
      setTimeout(() => {
        this.scrollToSection(targetId, 'auto');
      }, 400);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    if (this.heroIntroTimer) {
      clearTimeout(this.heroIntroTimer);
      this.heroIntroTimer = null;
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
    this.teardownFns.forEach((teardown) => teardown());
    this.teardownFns.length = 0;
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Google Health v2 HomeValueProps setup. Google drives the slides with CSS
   * scroll-driven animations (animation-timeline: view()); this is a JS port of the
   * same math because Safari/Firefox support for scroll timelines is still incomplete.
   */
  private initHeroSlider(): void {
    const root: HTMLElement = this.el.nativeElement;
    this.hvpSection = root.querySelector('.js-hvp');
    this.hvpTrack = root.querySelector('.js-hvp-track');
    this.hvpSticky = root.querySelector('.js-hvp-sticky');
    if (!this.hvpSection || !this.hvpTrack || !this.hvpSticky) return;

    this.hvpSlides = Array.from(root.querySelectorAll<HTMLElement>('.js-hvp-slide'));
    this.hvpMedia = this.hvpSlides.map((slide) => slide.querySelector<HTMLElement>('.js-hvp-media'));
    this.hvpRevealed = this.hvpSlides.map(() => false);
    this.hvpSlideY = this.hvpSlides.map(() => Number.NaN);
    this.hvpMediaY = this.hvpSlides.map(() => Number.NaN);
    this.hvpSection.style.setProperty('--hvp-slides', String(this.hvpSlides.length));

    if (this.prefersReducedMotion) {
      // Static stacked layout: no pinning, no parallax, every slide fully visible
      this.hvpStatic = true;
      this.hvpSection.classList.add('gh-hvp--static');
      this.hvpSlides.forEach((_, index) => this.revealHeroSlide(index));
      return;
    }

    this.measureHeroSlider();
  }

  /** Cache stage height (100vh = large viewport, stable while mobile toolbars move) and track offset. */
  private measureHeroSlider(): void {
    if (!this.hvpTrack || !this.hvpSticky || this.hvpStatic) return;
    this.hvpHeight = this.hvpSticky.getBoundingClientRect().height || window.innerHeight;
    this.hvpTrackTop = this.hvpTrack.getBoundingClientRect().top + window.scrollY;
    this.hvpSlideY.fill(Number.NaN);
    this.hvpMediaY.fill(Number.NaN);
  }

  /**
   * Page-load choreography (Google Health v2 CustomHomeHero): the sanctuary photo settles
   * from scale(1.12) to 1 first, then slide 1's pills and lines cascade in.
   */
  private playHeroLoadAnimation(): void {
    const section = this.hvpSection;
    if (!section) return;

    if (this.prefersReducedMotion || this.hvpStatic) {
      section.classList.add('is-loaded');
      this.loadAnimationComplete = true;
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        section.classList.add('is-loaded');
        const delay = window.scrollY > 40 ? 0 : 220;
        this.heroIntroTimer = setTimeout(() => {
          this.heroIntroTimer = null;
          this.loadAnimationComplete = true;
          this.handleScrollCalculations();
        }, delay);
      });
    });
  }

  /**
   * IntersectionObserver for Google Health v2 scroll reveal animations & stat counters
   */
  private setupIntersectionObserver(): void {
    const pageEl = this.el.nativeElement.querySelector('.home-demo-page');
    const revealItems = this.el.nativeElement.querySelectorAll('.js-reveal-on-scroll');

    if (this.prefersReducedMotion) {
      revealItems.forEach((item: Element) => item.classList.add('is-revealed'));
      return;
    }

    const vh = window.innerHeight || 800;

    // 1. Reveal anything already visible in the initial viewport on load
    revealItems.forEach((item: Element) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < vh * 0.92 && rect.bottom > 0) {
        item.classList.add('is-revealed');
      }
    });

    // 2. Arm the Google Health v2 RevealAnimation system
    if (pageEl) {
      pageEl.classList.add('js-reveal-ready');
    }

    // 3. Observe all remaining sections so they smoothly glide up as they enter the viewport
    const rootMargin = '0px 0px 40px 0px';
    const threshold = 0.08;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    revealItems.forEach((item: Element) => {
      if (!item.classList.contains('is-revealed')) {
        this.observer?.observe(item);
      }
    });

    // Stats Section observer
    const statsSection = this.el.nativeElement.querySelector('.js-stats-section');
    if (statsSection) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.statsAnimated) {
              this.statsAnimated = true;
              this.animateStats();
              statsObserver.disconnect();
            }
          });
        },
        { threshold: 0.20 }
      );
      statsObserver.observe(statsSection);
    }
  }

  /**
   * Window listeners (registered outside Angular, removed in ngOnDestroy):
   * rAF-throttled scroll, debounced resize re-measure, and keyboard-focus handling so
   * tabbing into an off-screen slide lands that slide fully in view.
   */
  private setupScrollListener(): void {
    this.ngZone.runOutsideAngular(() => {
      const onScroll = () => {
        if (this.scrollRafId !== null) return;
        this.scrollRafId = requestAnimationFrame(() => {
          this.scrollRafId = null;
          this.handleScrollCalculations();
        });
      };
      const onResize = () => {
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.resizeTimer = null;
          this.measureHeroSlider();
          this.handleScrollCalculations();
        }, 150);
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') this.lastInputWasKeyboard = true;
      };
      const onPointerDown = () => {
        this.lastInputWasKeyboard = false;
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('orientationchange', onResize);
      window.addEventListener('keydown', onKeyDown, true);
      window.addEventListener('pointerdown', onPointerDown, true);
      this.teardownFns.push(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
        window.removeEventListener('keydown', onKeyDown, true);
        window.removeEventListener('pointerdown', onPointerDown, true);
      });

      if (this.hvpSection && this.hvpSticky && !this.hvpStatic) {
        const section = this.hvpSection;
        const stageEls: HTMLElement[] = [this.hvpSticky, ...this.hvpSlides];
        // overflow:hidden boxes remain programmatically scrollable; focus can nudge them
        const onStageScroll = (event: Event) => {
          const stageEl = event.currentTarget as HTMLElement;
          if (stageEl.scrollTop !== 0 || stageEl.scrollLeft !== 0) {
            stageEl.scrollTop = 0;
            stageEl.scrollLeft = 0;
          }
        };
        const onFocusIn = (event: FocusEvent) => this.handleHeroFocus(event);
        stageEls.forEach((stageEl) => stageEl.addEventListener('scroll', onStageScroll, { passive: true }));
        section.addEventListener('focusin', onFocusIn);
        this.teardownFns.push(() => {
          stageEls.forEach((stageEl) => stageEl.removeEventListener('scroll', onStageScroll));
          section.removeEventListener('focusin', onFocusIn);
        });
      }

      // Run once immediately so the initial viewport state is synchronized
      this.handleScrollCalculations();
    });
  }

  /** Keyboard users tabbing into a pinned (translated) slide: scroll that slide exactly into view. */
  private handleHeroFocus(event: FocusEvent): void {
    if (this.hvpStatic || !this.lastInputWasKeyboard) return;
    const target = event.target as HTMLElement | null;
    const slide = target?.closest<HTMLElement>('.js-hvp-slide');
    if (!slide) return;
    const index = this.hvpSlides.indexOf(slide);
    if (index < 0) return;

    // Wait for the browser's own focus scroll-into-view, then land exactly on the slide
    requestAnimationFrame(() => {
      if (Math.abs(this.hvpProgress - index) > 0.01) {
        this.scrollToHeroSlide(index, 'auto');
      }
    });
  }

  private handleScrollCalculations(): void {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Reads first, writes after (no forced style/layout between transform writes)
    const docHeight = this.progressBarEl ? document.documentElement.scrollHeight - vh : 0;
    const valuePropsRect = this.valuePropsTrackEl ? this.valuePropsTrackEl.getBoundingClientRect() : null;

    // 0. Hairline scroll progress bar
    if (this.progressBarEl && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      this.progressBarEl.style.width = `${progress.toFixed(2)}%`;
    }

    // 1. Hero: Google Health v2 HomeValueProps pinned slider
    this.updateHeroSlider(scrollY);

    // 2. Value Props section progress
    if (valuePropsRect) {
      this.slideProgress = Math.min(
        1,
        Math.max(0, (vh - valuePropsRect.top) / (vh + valuePropsRect.height))
      );
    }
  }

  /**
   * Per-frame slider update (Google HomeValueProps keyframes, expressed in px):
   *   slide i:  translateY =  clamp(i - p, -1, 1) * H          → swipes 1:1 with scroll
   *   media i:  translateY = -0.8 * clamp(i - p, -1, 1) * H    → photo drifts at 20% speed
   *   last media keeps drifting (+0.8 * exit * H) while the stage scrolls away.
   */
  private updateHeroSlider(scrollY: number): void {
    const count = this.hvpSlides.length;
    const stageHeight = this.hvpHeight;
    if (this.hvpStatic || count === 0 || stageHeight <= 0) return;

    const rawScroll = scrollY - this.hvpTrackTop;
    const scrolled = Math.min(count * stageHeight, Math.max(0, rawScroll));
    const progress = Math.min(count - 1, scrolled / stageHeight);
    const exit = Math.min(1, Math.max(0, (scrolled - (count - 1) * stageHeight) / stageHeight));
    const dpr = window.devicePixelRatio || 1;
    this.hvpProgress = progress;

    for (let i = 0; i < count; i++) {
      const offset = Math.max(-1, Math.min(1, i - progress));

      // Snap slide edges to device pixels so adjacent slides never open a hairline seam
      const slideY = Math.round(offset * stageHeight * dpr) / dpr;
      if (slideY !== this.hvpSlideY[i]) {
        this.hvpSlideY[i] = slideY;
        this.hvpSlides[i].style.transform = `translate3d(0, ${slideY}px, 0)`;
      }

      const media = this.hvpMedia[i];
      if (media) {
        let mediaY = -0.8 * offset * stageHeight;
        if (i === count - 1) mediaY += 0.8 * exit * stageHeight;
        mediaY = Math.round(mediaY * 100) / 100;
        if (mediaY !== this.hvpMediaY[i]) {
          this.hvpMediaY[i] = mediaY;
          media.style.transform = `translate3d(0, ${mediaY}px, 0)`;
        }
      }

      // One-time reveal once the slide's top edge is between -30% and +50% of the stage
      const inRevealZone = offset > -0.3 && offset < 0.5 && rawScroll < count * stageHeight;
      if (inRevealZone && !this.hvpRevealed[i] && (i > 0 || this.loadAnimationComplete)) {
        this.revealHeroSlide(i);
      }
    }
  }

  /**
   * Google HomeValueProps.triggerLineReveal(): pills expand first (chapter openers only), the
   * eyebrow and headline lines follow (0.5s + 60ms stagger), then description lines (+0.3s) and CTAs.
   */
  private revealHeroSlide(index: number): void {
    const slide = this.hvpSlides[index];
    if (!slide || this.hvpRevealed[index]) return;
    this.hvpRevealed[index] = true;

    const content = slide.querySelector<HTMLElement>('.js-hvp-content');
    if (!content) return;

    const pills = content.querySelector<HTMLElement>('.js-hvp-pills');
    const lines = Array.from(content.querySelectorAll<HTMLElement>('.js-hvp-line'));
    const isHeadline = (line: HTMLElement) => !!line.closest('.gh-hvp__headline');
    const isDescription = (line: HTMLElement) => !!line.closest('.gh-hvp__description');
    const stagger = 0.06;
    const headlineStart = 0.5;
    const descriptionStart = headlineStart + lines.filter(isHeadline).length * stagger + 0.3;
    const ctaStart = descriptionStart + lines.filter(isDescription).length * stagger + 0.12;
    let headlineIndex = 0;
    let descriptionIndex = 0;
    let ctaIndex = 0;

    lines.forEach((line) => {
      let delay: number;
      if (isHeadline(line)) {
        delay = headlineStart + headlineIndex++ * stagger;
      } else if (isDescription(line)) {
        delay = descriptionStart + descriptionIndex++ * stagger;
      } else if (line.classList.contains('js-hvp-cta')) {
        delay = ctaStart + ctaIndex++ * 0.1;
      } else {
        delay = headlineStart - 0.1; // eyebrow leads the headline
      }
      line.style.setProperty('--animation-delay', `${delay.toFixed(2)}s`);
    });

    requestAnimationFrame(() => {
      pills?.classList.add('is-visible');
      lines.forEach((line) => line.classList.add('is-visible'));
    });
  }

  /**
   * Count-up numbers for impact metrics
   */
  private animateStats(): void {
    const duration = 1800;
    const start = performance.now();

    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);

      this.statHours = Math.floor(ease * 1200);
      this.statRating = Math.floor(ease * 100);
      this.statMinutes = 15;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        this.statHours = 1200;
        this.statRating = 100;
      }
    };

    requestAnimationFrame(frame);
  }

  scrollToSection(id: string, behavior: ScrollBehavior = 'smooth'): void {
    // Only plain element ids (the value can come from the URL hash / ?section=)
    if (!this.isBrowser || !/^[A-Za-z][\w-]*$/.test(id)) return;
    const target = this.el.nativeElement.querySelector(`#${id}`) as HTMLElement | null;
    if (!target) return;

    // Hero slides are pinned + transformed: map them to their scroll position instead
    const heroSlide = target.closest<HTMLElement>('.js-hvp-slide');
    if (heroSlide && this.hvpSlides.includes(heroSlide)) {
      this.scrollToHeroSlide(this.hvpSlides.indexOf(heroSlide), behavior);
      return;
    }
    if (target === this.hvpSection) {
      this.scrollToHeroSlide(0, behavior);
      return;
    }

    this.scrollWindowTo(target.getBoundingClientRect().top + window.scrollY - 70, behavior);
  }

  /** Scroll so hero slide `index` sits exactly in view (each slide = one viewport of pinned scroll). */
  scrollToHeroSlide(index: number, behavior: ScrollBehavior = 'smooth'): void {
    if (!this.isBrowser) return;
    const slide = this.hvpSlides[index];
    if (!slide) return;

    if (this.hvpStatic) {
      this.scrollWindowTo(slide.getBoundingClientRect().top + window.scrollY, behavior);
      return;
    }
    if (this.hvpHeight <= 0) this.measureHeroSlider();
    this.scrollWindowTo(this.hvpTrackTop + index * this.hvpHeight, behavior);
  }

  private scrollWindowTo(top: number, behavior: ScrollBehavior): void {
    const y = Math.max(0, Math.round(top));
    if (behavior === 'smooth') {
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      this.jumpTo(y);
    }
  }

  /** Instant jump: html has `scroll-behavior: smooth`, so bypass it for this one scroll. */
  private jumpTo(y: number): void {
    const rootStyle = document.documentElement.style;
    const previous = rootStyle.scrollBehavior;
    rootStyle.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    requestAnimationFrame(() => {
      rootStyle.scrollBehavior = previous;
    });
  }

  selectSlide(index: number): void {
    this.activeSlideIndex = index;
  }

  private router = inject(Router);

  openBooking(serviceName?: string): void {
    if (serviceName) {
      this.router.navigate(['/book'], { queryParams: { service: serviceName } });
    } else {
      this.router.navigate(['/book']);
    }
  }
}
