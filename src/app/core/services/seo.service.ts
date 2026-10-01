import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface RouteSeoMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  breadcrumbName: string;
}

const ROUTE_SEO_MAP: Record<string, RouteSeoMetadata> = {
  '': {
    title: 'MindKatha (mindkatha.in) | Clinical Psychotherapy & Adult ADHD Diagnostics in Pune',
    description:
      'MindKatha is an RCI-registered clinical psychology practice in Viman Nagar, Pune led by Leona Lahkar (#A84920). Individual psychotherapy, Adult ADHD evaluations (DIVA-5), burnout care, and psychometric assessments in-person and online.',
    canonicalPath: '/',
    breadcrumbName: 'Home'
  },
  services: {
    title: 'Therapy Services, Adult ADHD & Psychometric Testing | MindKatha Pune',
    description:
      'Explore 12 clinical psychotherapy and diagnostic modalities at MindKatha Pune: CBT, ACT, somatic trauma care, Adult ADHD diagnostic batteries (DIVA-5 & WAIS-IV), couples therapy, and MCMI-IV psychometric testing.',
    canonicalPath: '/services',
    breadcrumbName: 'Services & Specializations'
  },
  about: {
    title: 'Leona Lahkar — RCI Licensed Clinical Psychologist (#A84920) | MindKatha',
    description:
      'Meet Leona Lahkar (M.Sc. Clinical Psychology, PDCP, RCI Reg. #A84920), founder of MindKatha in Viman Nagar, Pune. Offering evidence-based, neuro-affirming, and queer-affirmative psychotherapy in English, Hindi, Assamese, and Bengali.',
    canonicalPath: '/about',
    breadcrumbName: 'About Leona Lahkar'
  },
  contact: {
    title: 'Contact Viman Nagar Studio & Clinical FAQs | MindKatha Pune',
    description:
      'Visit the MindKatha clinical psychology studio at Disha Eternia, Sakore Nagar, Viman Nagar, Pune 411014, or connect via encrypted telehealth. Read answers to common questions on fees, insurance superbills, and intake sessions.',
    canonicalPath: '/contact',
    breadcrumbName: 'Contact & FAQs'
  },
  book: {
    title: 'Book a Therapy Session or Free Discovery Call | MindKatha Pune',
    description:
      'Schedule a 50-minute clinical psychotherapy intake, Adult ADHD diagnostic evaluation, couples consultation, or complimentary discovery audio call with RCI-registered Clinical Psychologist Leona Lahkar.',
    canonicalPath: '/book',
    breadcrumbName: 'Book a Session'
  },
  legal: {
    title: 'Legal, Privacy Policy & Clinical Informed Consent | MindKatha',
    description:
      'Review MindKatha ethical guidelines, DPDP Act 2023 data privacy protections, outpatient clinical informed consent, and 24-hour appointment cancellation policies.',
    canonicalPath: '/legal',
    breadcrumbName: 'Legal & Ethics'
  },
  privacy: {
    title: 'Privacy Policy & DPDP Act 2023 Compliance | MindKatha',
    description:
      'How MindKatha protects your clinical confidentiality, session records, and encrypted telehealth consultations under RCI ethics and the Digital Personal Data Protection Act (DPDP Act 2023).',
    canonicalPath: '/privacy',
    breadcrumbName: 'Privacy Policy'
  },
  terms: {
    title: 'Terms of Service & Cancellation Policy | MindKatha',
    description:
      'Outpatient practice policies, session duration, 24-to-48-hour rescheduling notice, direct self-pay billing, and insurance reimbursement superbills at MindKatha.',
    canonicalPath: '/terms',
    breadcrumbName: 'Terms & Policies'
  },
  consent: {
    title: 'Clinical Informed Consent & Ethical Scope | MindKatha',
    description:
      'Clinical informed consent framework for outpatient psychotherapy, telehealth privacy guidelines, and statutory limits of confidentiality at MindKatha Pune.',
    canonicalPath: '/consent',
    breadcrumbName: 'Informed Consent'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly baseUrl = 'https://mindkatha.in';

  updateForUrl(rawUrl: string): void {
    const cleanPath = rawUrl.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '');
    const seo = ROUTE_SEO_MAP[cleanPath] || ROUTE_SEO_MAP[''];
    const canonicalUrl =
      seo.canonicalPath === '/' ? `${this.baseUrl}/` : `${this.baseUrl}${seo.canonicalPath}`;

    this.titleService.setTitle(seo.title);

    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });

    this.updateCanonicalLink(canonicalUrl);
    this.updateBreadcrumbSchema(cleanPath, seo.breadcrumbName, canonicalUrl);
  }

  private updateCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateBreadcrumbSchema(
    cleanPath: string,
    breadcrumbName: string,
    canonicalUrl: string
  ): void {
    const items: Array<Record<string, unknown>> = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${this.baseUrl}/`
      }
    ];

    if (cleanPath && cleanPath !== '') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbName,
        item: canonicalUrl
      });
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    };

    let scriptEl = this.doc.getElementById('mk-breadcrumb-schema') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = this.doc.createElement('script');
      scriptEl.id = 'mk-breadcrumb-schema';
      scriptEl.type = 'application/ld+json';
      this.doc.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schema);
  }
}
