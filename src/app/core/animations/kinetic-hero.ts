import { trigger, transition, style, animate } from '@angular/animations';

export const kineticHeroTrigger = trigger('kineticHero', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(24px)' }),
    animate('700ms {{delay}} cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ], { params: { delay: '0ms' } })
]);
