import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.scss'
})
export class LegalPageComponent implements OnInit {
  private router = inject(Router);
  activeTab: 'privacy' | 'terms' | 'consent' = 'privacy';

  ngOnInit(): void {
    const url = this.router.url.toLowerCase();
    if (url.includes('terms')) {
      this.activeTab = 'terms';
    } else if (url.includes('consent')) {
      this.activeTab = 'consent';
    } else {
      this.activeTab = 'privacy';
    }
  }

  setTab(tab: 'privacy' | 'terms' | 'consent') {
    this.activeTab = tab;
  }
}
