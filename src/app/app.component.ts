import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'mindkatha-app-ng';
  private router = inject(Router);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateForUrl(this.router.url);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.seoService.updateForUrl(event.urlAfterRedirects || event.url);
      if (typeof window !== 'undefined') {
        const hasDeepLink =
          window.location.hash.length > 1 ||
          window.location.search.includes('scroll=') ||
          window.location.search.includes('section=');
        if (!hasDeepLink) {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }
    });
  }
}
