import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav aria-label="Breadcrumb" class="mb-5 flex items-center justify-center sm:justify-start">
      <ol
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
        class="inline-flex flex-wrap items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 text-xs text-slate-600 shadow-2xs"
      >
        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
          class="inline-flex items-center"
        >
          <a
            itemprop="item"
            routerLink="/"
            class="hover:text-[#0284c7] font-medium transition-colors inline-flex items-center gap-1"
          >
            <i class="ph ph-house text-[#0284c7]" aria-hidden="true"></i>
            <span itemprop="name">Home</span>
          </a>
          <meta itemprop="position" content="1" />
        </li>

        <li aria-hidden="true" class="text-slate-300 select-none">/</li>

        @if (parentLabel && parentLink) {
          <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
            class="inline-flex items-center"
          >
            <a
              itemprop="item"
              [routerLink]="parentLink"
              class="hover:text-[#0284c7] font-medium transition-colors"
            >
              <span itemprop="name">{{ parentLabel }}</span>
            </a>
            <meta itemprop="position" content="2" />
          </li>
          <li aria-hidden="true" class="text-slate-300 select-none">/</li>
        }

        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
          class="inline-flex items-center font-semibold text-slate-900"
          aria-current="page"
        >
          <span itemprop="name">{{ currentLabel }}</span>
          <meta itemprop="position" [attr.content]="parentLabel ? '3' : '2'" />
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input({ required: true }) currentLabel = '';
  @Input() parentLabel?: string;
  @Input() parentLink?: string;
}
