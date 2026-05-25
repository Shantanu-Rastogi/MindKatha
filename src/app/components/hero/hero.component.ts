import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { kineticHeroTrigger } from '../../core/animations/kinetic-hero';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [kineticHeroTrigger]
})
export class HeroComponent {
}
