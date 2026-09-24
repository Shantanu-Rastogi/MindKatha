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

  // Hero state management
  private activeHeroBlock: 'text1' | 'fading-to-2' | 'text2' | 'fading-to-1' = 'text1';
  private activeHero2Block: 'text1' | 'fading-to-2' | 'text2' | 'fading-to-1' = 'text1';
  private heroFadeTimer: any = null;
  private heroIntroTimer: any = null;
  private hero2IntroTimer: any = null;
  private safetyTimer: any = null;
  loadAnimationComplete = false;
  private hero2LoadTriggered = false;
  private hero2LoadAnimationComplete = false;

  // Stat Counter states
  statsAnimated = false;
  statHours = 1200;
  statRating = 100;
  statMinutes = 15;

  // 3-Step Clinical Care Journey
  readonly careSteps: CareProcessStep[] = [
    {
      stepNum: '01',
      duration: '15 Mins • Complimentary',
      title: 'Discovery Audio Check-In',
      description:
        'A brief, zero-pressure phone or audio conversation to share what brings you to therapy, ask questions about our approach, and ensure mutual comfort before booking.',
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

    this.playHeroLoadAnimation();
    this.setupIntersectionObserver();
    this.setupScrollListener();

    // Check for URL hash or ?section= query param to scroll directly
    const targetId = window.location.hash.replace('#', '') || new URLSearchParams(window.location.search).get('section');
    if (targetId) {
      setTimeout(() => {
        this.scrollToSection(targetId, 'auto');
      }, 400);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
    }
    if (this.heroFadeTimer) {
      clearTimeout(this.heroFadeTimer);
    }
    if (this.heroIntroTimer) {
      clearTimeout(this.heroIntroTimer);
    }
    if (this.hero2IntroTimer) {
      clearTimeout(this.hero2IntroTimer);
    }
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Choreographed 2-Stage Page Load Sequence (Image First -> Text Second):
   * Stage 1 (0ms): Immediately triggers background image scale-down (1.08 -> 1.0), unblur, and fade-in
   *                while Text 1 remains hidden (`is-hidden`) so the sanctuary image smoothly transitions first.
   * Stage 2 (850ms): Once the sanctuary image has smoothly settled into view, Text 1 glides up with a
   *                  staggered line-by-line cascade (`is-visible`).
   */
  private playHeroLoadAnimation(): void {
    const hero = this.el.nativeElement.querySelector('.js-hero-container');
    const text1 = this.el.nativeElement.querySelector('.js-hero-text-1');
    if (!hero) return;

    requestAnimationFrame(() => {
      // Stage 1: Smoothly transition the background sanctuary image FIRST
      hero.classList.add('is-loaded');

      // Stage 2: Transition the primary text AFTER the image transition settles
      const textRevealDelay = this.prefersReducedMotion ? 0 : 850;
      this.heroIntroTimer = setTimeout(() => {
        if (text1 && this.activeHeroBlock === 'text1') {
          text1.classList.remove('is-hidden');
          text1.classList.add('is-visible');
        }
        this.loadAnimationComplete = true;
      }, textRevealDelay);
    });
  }

  /**
   * IntersectionObserver for scroll reveal animations & stat counters
   */
  private setupIntersectionObserver(): void {
    const pageEl = this.el.nativeElement.querySelector('.home-demo-page');
    const revealItems = this.el.nativeElement.querySelectorAll('.js-reveal-on-scroll');

    if (this.prefersReducedMotion) {
      revealItems.forEach((item: Element) => item.classList.add('is-revealed'));
      return;
    }

    const vh = window.innerHeight || 800;
    const isMobile = window.innerWidth < 768;

    // 1. Reveal anything already in or above the visible viewport on initial render
    revealItems.forEach((item: Element) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < vh * 0.90) {
        item.classList.add('is-revealed');
      }
    });

    // 2. Arm the animation system once above-the-fold content is secured
    if (pageEl) {
      pageEl.classList.add('js-reveal-ready');
    }

    // 3. Responsive IntersectionObserver:
    // Mobile: -35px margin triggers cleanly as elements emerge into comfortable thumb view
    // Desktop: -55px provides a graceful floating elevation
    const rootMargin = isMobile ? '0px 0px -35px 0px' : '0px 0px -55px 0px';
    const threshold = isMobile ? 0.05 : 0.08;

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

    // 4. Safety net: Guarantee all content is 100% visible after 3.5s
    this.safetyTimer = setTimeout(() => {
      revealItems.forEach((item: Element) => {
        if (!item.classList.contains('is-revealed')) {
          item.classList.add('is-revealed');
        }
      });
    }, 3500);

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
   * Centralized high-performance scroll handling:
   * 1. Google Health-style hero parallax & subtle depth zoom (active on BOTH desktop and mobile)
   * 2. Hero Text 1 / Text 2 seamless cross-fade on the same background
   * 3. Hairline reading progress bar calculation
   */
  private setupScrollListener(): void {
    if (this.prefersReducedMotion) return;

    this.ngZone.runOutsideAngular(() => {
      const onScroll = () => {
        if (this.scrollRafId !== null) return;
        this.scrollRafId = requestAnimationFrame(() => {
          this.handleScrollCalculations();
          this.scrollRafId = null;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      // Run once immediately so initial viewport state is synchronized
      this.handleScrollCalculations();
    });
  }

  private handleScrollCalculations(): void {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const isDesktop = window.innerWidth >= 768;

    // =========================================================================
    // 0. Hairline Scroll Progress Bar
    // =========================================================================
    const progressBar = this.el.nativeElement.querySelector('.js-scroll-progress-bar');
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - vh;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = `${progress.toFixed(2)}%`;
      }
    }

    // =========================================================================
    // 1. Hero Parallax & Text Blocks (Same Image Storytelling on Desktop & Mobile)
    // =========================================================================
    const heroContainer = this.el.nativeElement.querySelector('.js-hero-container');
    if (heroContainer) {
      const heroRect = heroContainer.getBoundingClientRect();
      const heroBg = this.el.nativeElement.querySelector('.js-hero-bg');
      const text1 = this.el.nativeElement.querySelector('.js-hero-text-1');
      const text2 = this.el.nativeElement.querySelector('.js-hero-text-2');
      const scrollHint = this.el.nativeElement.querySelector('.js-hero-scroll-hint');

      if (heroRect.bottom > 0 && heroRect.top <= 0) {
        const scrollIntoHero = -heroRect.top;
        const maxScroll = Math.max(1, heroContainer.offsetHeight - vh);
        const heroFraction = Math.min(1, Math.max(0, scrollIntoHero / maxScroll));

        // Smooth Parallax & Depth Scale on BOTH desktop and mobile
        if (heroBg) {
          const bgOvershoot = isDesktop ? vh * 0.08 : vh * 0.10;
          const offset = Math.round(-heroFraction * bgOvershoot);
          const depthScale = isDesktop ? 1 : 1 + heroFraction * 0.045;
          heroBg.style.transform = `translate3d(0, ${offset}px, 0) scale(${depthScale.toFixed(4)})`;
        }

        // Scroll Hint auto-hides once scrolled, and restores at top
        if (scrollHint) {
          if (scrollIntoHero > 40) {
            scrollHint.classList.add('is-hidden');
          } else {
            scrollHint.classList.remove('is-hidden');
          }
        }

        // Text 1 / Text 2 Switching on the same image with smooth hysteresis
        if (text1 && text2) {
          if (heroFraction > 0.16) {
            // Ensure load animation state is marked complete if user scrolls down quickly
            this.loadAnimationComplete = true;
            if (this.activeHeroBlock !== 'text2') {
              this.activeHeroBlock = 'text2';
              text1.classList.remove('is-visible');
              text1.classList.add('is-hidden');
              text2.classList.remove('is-hidden');
              text2.classList.add('is-visible');
            }
          } else if (this.loadAnimationComplete && this.activeHeroBlock === 'text2' && heroFraction <= 0.10) {
            this.activeHeroBlock = 'text1';
            text2.classList.remove('is-visible');
            text2.classList.add('is-hidden');
            text1.classList.remove('is-hidden');
            text1.classList.add('is-visible');
          }
        }
      }
    }

    // =========================================================================
    // 1B. Hero 2 Choreographed Image-First Reveal + Parallax & Text Blocks
    // =========================================================================
    const hero2Container = this.el.nativeElement.querySelector('.js-hero-2-container');
    if (hero2Container) {
      const hero2Rect = hero2Container.getBoundingClientRect();
      const hero2Bg = this.el.nativeElement.querySelector('.js-hero-2-bg');
      const text2_1 = this.el.nativeElement.querySelector('.js-hero-2-text-1');
      const text2_2 = this.el.nativeElement.querySelector('.js-hero-2-text-2');
      const scrollHint2 = this.el.nativeElement.querySelector('.js-hero-2-scroll-hint');

      // Stage 1 -> Stage 2 Image-First Choreography when Hero 2 enters viewport
      if (hero2Rect.top < vh * 0.96 && !this.hero2LoadTriggered) {
        this.hero2LoadTriggered = true;
        hero2Container.classList.add('is-loaded');
        const delay2Ms = this.prefersReducedMotion ? 0 : 380;
        this.hero2IntroTimer = setTimeout(() => {
          this.hero2LoadAnimationComplete = true;
          if (text2_1 && this.activeHero2Block === 'text1') {
            text2_1.classList.remove('is-hidden');
            text2_1.classList.add('is-visible');
          }
        }, delay2Ms);
      }

      if (hero2Rect.bottom > 0 && hero2Rect.top <= 0) {
        const scrollIntoHero2 = -hero2Rect.top;
        const maxScroll2 = Math.max(1, hero2Container.offsetHeight - vh);
        const hero2Fraction = Math.min(1, Math.max(0, scrollIntoHero2 / maxScroll2));

        // Smooth Parallax & Depth Scale on BOTH desktop and mobile
        if (hero2Bg) {
          const bgOvershoot = isDesktop ? vh * 0.08 : vh * 0.10;
          const offset = Math.round(-hero2Fraction * bgOvershoot);
          const depthScale = isDesktop ? 1 : 1 + hero2Fraction * 0.045;
          hero2Bg.style.transform = `translate3d(0, ${offset}px, 0) scale(${depthScale.toFixed(4)})`;
        }

        if (scrollHint2) {
          if (scrollIntoHero2 > 40) {
            scrollHint2.classList.add('is-hidden');
          } else {
            scrollHint2.classList.remove('is-hidden');
          }
        }

        if (text2_1 && text2_2) {
          if (hero2Fraction > 0.16) {
            hero2Container.classList.add('is-loaded');
            this.hero2LoadAnimationComplete = true;
            if (this.activeHero2Block !== 'text2') {
              this.activeHero2Block = 'text2';
              text2_1.classList.remove('is-visible');
              text2_1.classList.add('is-hidden');
              text2_2.classList.remove('is-hidden');
              text2_2.classList.add('is-visible');
            }
          } else if (this.hero2LoadAnimationComplete && this.activeHero2Block === 'text2' && hero2Fraction <= 0.10) {
            this.activeHero2Block = 'text1';
            text2_2.classList.remove('is-visible');
            text2_2.classList.add('is-hidden');
            text2_1.classList.remove('is-hidden');
            text2_1.classList.add('is-visible');
          }
        }
      }
    }

    // =========================================================================
    // 2. Value Props Section Progress
    // =========================================================================
    const track = this.el.nativeElement.querySelector('.js-value-props-track');
    if (track) {
      const trackRect = track.getBoundingClientRect();
      const visibleFraction = Math.min(1, Math.max(0, (vh - trackRect.top) / (vh + trackRect.height)));
      this.slideProgress = visibleFraction;
    }
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
    if (!this.isBrowser) return;
    const target = this.el.nativeElement.querySelector(`#${id}`);
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({
        top: Math.max(0, topOffset),
        behavior
      });
    }
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
