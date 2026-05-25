import { Component, inject } from '@angular/core';
import { TherapyDataService } from '../../core/services/therapy-data.service';
import { FAQItem } from '../../core/models/therapy.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  private dataService = inject(TherapyDataService);
  faqs: FAQItem[] = this.dataService.getFAQs();
}

