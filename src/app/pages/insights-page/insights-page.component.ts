import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TherapyDataService } from '../../core/services/therapy-data.service';
import { Article } from '../../core/models/therapy.model';

@Component({
  selector: 'app-insights-page',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './insights-page.component.html',
  styleUrl: './insights-page.component.scss'
})
export class InsightsPageComponent {
  private dataService = inject(TherapyDataService);
  articles: Article[] = this.dataService.getArticles();
}
