import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TherapyDataService } from '../../core/services/therapy-data.service';
import { TherapyService } from '../../core/models/therapy.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  private dataService = inject(TherapyDataService);
  services: TherapyService[] = this.dataService.getServices();
}
