import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TherapyDataService } from '../../core/services/therapy-data.service';
import { Specialization } from '../../core/models/therapy.model';

@Component({
  selector: 'app-specializations-page',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './specializations-page.component.html',
  styleUrl: './specializations-page.component.scss'
})
export class SpecializationsPageComponent {
  private dataService = inject(TherapyDataService);
  specializations: Specialization[] = this.dataService.getSpecializations();
}
