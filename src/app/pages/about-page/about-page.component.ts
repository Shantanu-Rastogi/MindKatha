import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { TherapyDataService } from '../../core/services/therapy-data.service';
import { Modality } from '../../core/models/therapy.model';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [NgClass],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {
  private dataService = inject(TherapyDataService);
  modalities: Modality[] = this.dataService.getModalities();

  leonaPortraitUrl = 'assets/images/leona_portrait.png';
  profile = {
    name: 'Leona Lahkar',
    credentials: ['RCI Registered', 'Clinical Psychologist', 'M.Sc. Clinical Psychology', 'PDCP'],
    experienceLead: 'With 5+ years of clinical expertise across NGOs, hospitals, and E-platforms in Mumbai and Pune, Leona is dedicated to understanding your script.',
    specialization: [
      'She is well-versed with clinical diagnosis, psychometric assessments, and psychotherapy for children, teens, adults, and elderly. Her eclectic approach to therapy caters specifically to her clients based on their unique needs and goals.',
      'Leona is extensively trained in CBT, DBT, ERPT, Behaviour modification, MET, and relapse prevention. Her versatility in working with clients from all walks of life adds significant flexibility to her expertise.'
    ],
    affirmations: [
      { text: 'Trauma-Informed', icon: 'ph-heart-break' },
      { text: 'Queer Affirmative', icon: 'ph-rainbow' }
    ]
  };
}
