import { Directive, ElementRef, OnInit, OnDestroy, Input, Renderer2, inject, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  @Input() revealAnimation: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-left' | 'slide-right' = 'fade-up';
  @Input() revealDelay: number = 0; // ms
  @Input() revealThreshold: number = 0.01;
  private safetyTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    const el = this.el.nativeElement as HTMLElement;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.renderer.addClass(el, 'is-revealed');
      return;
    }

    // Set initial animation setup
    this.renderer.addClass(el, `reveal-init-${this.revealAnimation}`);
    if (this.revealDelay > 0) {
      this.renderer.setStyle(el, 'transition-delay', `${Math.min(this.revealDelay, 150)}ms`);
    }

    // Immediately reveal if already within or near the initial viewport
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 812;
      if (rect.top <= vh + 100) {
        this.renderer.addClass(el, 'is-revealed');
      }
    });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          this.renderer.addClass(el, 'is-revealed');
          this.observer?.unobserve(el);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px 100px 0px'
    });

    this.observer.observe(el);

    // Guaranteed safety fallback so tall mobile containers never stay hidden
    this.safetyTimer = setTimeout(() => {
      this.renderer.addClass(el, 'is-revealed');
    }, 450);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
    }
  }
}

@Directive({
  selector: '[appCardSpotlight]',
  standalone: true
})
export class CardSpotlightDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.renderer.setStyle(this.el.nativeElement, '--mouse-x', `${x}px`);
    this.renderer.setStyle(this.el.nativeElement, '--mouse-y', `${y}px`);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.addClass(this.el.nativeElement, 'spotlight-active');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.removeClass(this.el.nativeElement, 'spotlight-active');
  }
}
