import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TherapyDataService } from '../../services/therapy-data.service';
import { FAQItem } from '../../models/therapy.model';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-faq-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './faq-contact.component.html',
  styleUrl: './faq-contact.component.scss'
})
export class FaqContactComponent {
  private dataService = inject(TherapyDataService);
  faqs: FAQItem[] = this.dataService.getFAQs().slice(0, 5);
}

