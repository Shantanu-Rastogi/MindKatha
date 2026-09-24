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
  @Input() revealThreshold: number = 0.1;

  ngOnInit() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      this.renderer.addClass(this.el.nativeElement, 'is-revealed');
      return;
    }

    // Set initial animation setup
    this.renderer.addClass(this.el.nativeElement, `reveal-init-${this.revealAnimation}`);
    if (this.revealDelay > 0) {
      this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${this.revealDelay}ms`);
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, 'is-revealed');
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, {
      threshold: this.revealThreshold,
      rootMargin: '0px 0px -30px 0px'
    });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
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
