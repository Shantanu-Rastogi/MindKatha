import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TherapyDataService } from '../../core/services/therapy-data.service';
import { Specialization } from '../../core/models/therapy.model';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';

@Component({
  selector: 'app-specializations-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './specializations-page.component.html',
  styleUrl: './specializations-page.component.scss'
})
export class SpecializationsPageComponent {
  private dataService = inject(TherapyDataService);
  specializations: Specialization[] = this.dataService.getSpecializations();

  expandedTitles = new Set<string>();

  isExpanded(title: string): boolean {
    return this.expandedTitles.has(title);
  }

  toggleExpand(title: string) {
    if (this.expandedTitles.has(title)) {
      this.expandedTitles.delete(title);
    } else {
      this.expandedTitles.add(title);
    }
  }
}
