import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
  NgZone
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  MINDKATHA_BRAIN_SYNAPSE,
  MINDKATHA_BRAIN_MICRO,
  MINDKATHA_LOGO_LOCKUP
} from './logo-lab-lotties';

declare global {
  interface Window {
    lottie?: any;
  }
}

const LOTTIE_CDN = 'https://ssl.gstatic.com/external_hosted/lottie/lottie_light.js';

@Component({
  selector: 'app-logo-lab-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './logo-lab-page.component.html',
  styleUrls: ['./logo-lab-page.component.scss']
})
export class LogoLabPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private el = inject(ElementRef);
  isBrowser = false;

  // Active theme and mode
  currentTheme: 'dark' | 'light' | 'cyan' = 'dark';
  currentSpeed = 1.0;
  isPlaying = true;
  navbarHovered = false;

  // Lottie instances
  private masterAnim: any = null;
  private navbarAnim: any = null;
  private lockupAnim: any = null;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.loadLottieAndInit();
  }

  ngOnDestroy(): void {
    if (this.masterAnim) this.masterAnim.destroy();
    if (this.navbarAnim) this.navbarAnim.destroy();
    if (this.lockupAnim) this.lockupAnim.destroy();
  }

  private loadLottieAndInit(): void {
    if (window.lottie) {
      this.initAnimations();
      return;
    }

    const script = document.createElement('script');
    script.src = LOTTIE_CDN;
    script.async = true;
    script.onload = () => {
      this.ngZone.run(() => {
        this.initAnimations();
      });
    };
    document.head.appendChild(script);
  }

  private initAnimations(): void {
    if (!window.lottie) return;

    // 1. Master Synapse Animation
    const masterSlot = this.el.nativeElement.querySelector('#master-lottie-slot');
    if (masterSlot) {
      masterSlot.innerHTML = '';
      this.masterAnim = window.lottie.loadAnimation({
        container: masterSlot,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: MINDKATHA_BRAIN_SYNAPSE
      });
      this.masterAnim.setSpeed(this.currentSpeed);
    }

    // 2. Navbar Micro Animation
    const navbarSlot = this.el.nativeElement.querySelector('#navbar-lottie-slot');
    if (navbarSlot) {
      navbarSlot.innerHTML = '';
      this.navbarAnim = window.lottie.loadAnimation({
        container: navbarSlot,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: MINDKATHA_BRAIN_MICRO
      });
    }

    // 3. Brand Lockup Animation
    const lockupSlot = this.el.nativeElement.querySelector('#lockup-lottie-slot');
    if (lockupSlot) {
      lockupSlot.innerHTML = '';
      this.lockupAnim = window.lottie.loadAnimation({
        container: lockupSlot,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: MINDKATHA_LOGO_LOCKUP
      });
    }
  }

  setTheme(theme: 'dark' | 'light' | 'cyan'): void {
    this.currentTheme = theme;
  }

  setSpeed(speed: number): void {
    this.currentSpeed = speed;
    if (this.masterAnim) this.masterAnim.setSpeed(speed);
    if (this.navbarAnim) this.navbarAnim.setSpeed(speed);
    if (this.lockupAnim) this.lockupAnim.setSpeed(speed);
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      if (this.masterAnim) this.masterAnim.play();
      if (this.navbarAnim) this.navbarAnim.play();
      if (this.lockupAnim) this.lockupAnim.play();
    } else {
      if (this.masterAnim) this.masterAnim.pause();
      if (this.navbarAnim) this.navbarAnim.pause();
      if (this.lockupAnim) this.lockupAnim.pause();
    }
  }

  triggerBurst(): void {
    if (!this.masterAnim) return;
    this.masterAnim.setSpeed(2.4);
    const flashEl = this.el.nativeElement.querySelector('.js-burst-flash');
    if (flashEl) {
      flashEl.classList.remove('is-flashing');
      void flashEl.offsetWidth; // trigger reflow
      flashEl.classList.add('is-flashing');
    }
    setTimeout(() => {
      if (this.masterAnim) this.masterAnim.setSpeed(this.currentSpeed);
    }, 1200);
  }

  onNavbarLogoEnter(): void {
    this.navbarHovered = true;
    if (this.navbarAnim) this.navbarAnim.setSpeed(2.0);
  }

  onNavbarLogoLeave(): void {
    this.navbarHovered = false;
    if (this.navbarAnim) this.navbarAnim.setSpeed(1.0);
  }
}
