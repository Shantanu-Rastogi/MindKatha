import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-author-bio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <aside
      aria-label="Clinical Author and Reviewer Biography"
      itemscope
      itemtype="https://schema.org/Person"
      class="mt-12 p-5 sm:p-7 rounded-[24px] bg-white border border-slate-200/90 shadow-[0_8px_24px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
    >
      <div class="flex items-start sm:items-center gap-4">
        <a routerLink="/about" class="shrink-0 block rounded-2xl overflow-hidden border border-sky-200/80 bg-sky-50">
          <img
            itemprop="image"
            src="assets/images/leona_portrait.webp"
            alt="Leona Lahkar, RCI-Registered Clinical Psychologist (#A84920) at MindKatha Pune"
            width="72"
            height="90"
            loading="lazy"
            decoding="async"
            class="w-16 h-20 sm:w-[72px] sm:h-[90px] object-cover"
          />
        </a>
        <div class="space-y-1">
          <div class="inline-flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-[#0284c7] text-[10.5px] font-bold uppercase tracking-wider">
              Clinically Authored &amp; Reviewed
            </span>
            <span class="text-[11px] font-semibold text-slate-500">
              RCI Reg. #A84920 • M.Sc. Clinical Psychology &amp; PDCP
            </span>
          </div>
          <h3 class="text-base sm:text-lg font-bold text-slate-900">
            <a routerLink="/about" itemprop="url" class="hover:text-[#0284c7] transition-colors">
              <span itemprop="name">Leona Lahkar</span>
            </a>
            <span itemprop="jobTitle" class="text-xs sm:text-sm font-medium text-slate-500 ml-1.5">
              — RCI-Licensed Clinical Psychologist
            </span>
          </h3>
          <p itemprop="description" class="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-2xl">
            Leona leads clinical formulation, adult ADHD diagnostic evaluations (DIVA-5 &amp; WAIS-IV), and trauma-informed psychotherapy at MindKatha in Viman Nagar, Pune and via encrypted telehealth across India.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <a routerLink="/about" class="gh-btn gh-btn--secondary !py-2 !px-4 !text-xs w-full sm:w-auto justify-center">
          <span>Full Clinical Bio</span>
        </a>
        <a routerLink="/book" class="gh-btn gh-btn--primary !py-2 !px-4 !text-xs w-full sm:w-auto justify-center">
          <span>Book with Leona</span>
        </a>
      </div>
    </aside>
  `
})
export class AuthorBioComponent {}
