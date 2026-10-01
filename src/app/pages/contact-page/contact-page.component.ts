import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../core/directives/scroll-reveal.directive';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AuthorBioComponent } from '../../components/author-bio/author-bio.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, BreadcrumbComponent, AuthorBioComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss'
})
export class ContactPageComponent {}

