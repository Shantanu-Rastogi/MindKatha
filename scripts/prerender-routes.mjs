import fs from 'node:fs';
import path from 'node:path';

const distBrowserDir = path.resolve('dist/mindkatha-app-ng/browser');
const baseIndexPath = path.join(distBrowserDir, 'index.html');

if (!fs.existsSync(baseIndexPath)) {
  console.error('Error: base index.html not found at', baseIndexPath);
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');
const baseUrl = 'https://mindkatha.in';

const routes = [
  {
    slug: 'services',
    title: 'Therapy Services, Adult ADHD & Psychometric Testing | MindKatha Pune',
    description:
      'Explore 12 clinical psychotherapy and diagnostic modalities at MindKatha Pune: CBT, ACT, somatic trauma care, Adult ADHD diagnostic batteries (DIVA-5 & WAIS-IV), couples therapy, and MCMI-IV psychometric testing.',
    breadcrumbName: 'Services & Specializations',
    h1: 'Therapy Services & Clinical Specializations at MindKatha Pune',
    bodyHtml: `
      <p>MindKatha offers 12 evidence-based psychotherapy and diagnostic assessment tracks led by RCI-Registered Clinical Psychologist <strong>Leona Lahkar (#A84920)</strong> in Viman Nagar, Pune and via encrypted online telehealth:</p>
      <ul>
        <li><strong>Individual Psychotherapy &amp; Emotional Regulation (50 mins):</strong> CBT, ACT, and somatic grounding for anxiety, panic, and mood regulation.</li>
        <li><strong>Occupational Burnout &amp; High-Performance Restoration (50 mins):</strong> Polyvagal and boundary protocols for engineers, founders, and corporate professionals.</li>
        <li><strong>Trauma-Informed Healing &amp; Complex Grief Processing:</strong> Phased somatic and attachment-focused recovery.</li>
        <li><strong>Comprehensive Adult ADHD Diagnostic Evaluation (DIVA-5 &amp; WAIS-IV):</strong> Two-phase standardized evaluation with a signed RCI diagnostic dossier.</li>
        <li><strong>Neurodivergent Executive Functioning &amp; De-Masking Support:</strong> Practical workflows for ADHD, AuDHD, and RSD.</li>
        <li><strong>Couples &amp; Relational Communication Mediation (Gottman &amp; EFT):</strong> Structured partner conflict resolution and attachment repair.</li>
        <li><strong>Pre-Marital Alignment &amp; Relational Readiness:</strong> 4-session preventative track for couples.</li>
        <li><strong>Queer, Trans &amp; LGBTQIA+ Affirmative Psychotherapy:</strong> Identity-affirming clinical space.</li>
        <li><strong>Standardized Psychometric &amp; Personality Assessment:</strong> MCMI-IV, MMPI-2, Rorschach, and TAT batteries.</li>
      </ul>`
  },
  {
    slug: 'about',
    title: 'Leona Lahkar — RCI Licensed Clinical Psychologist (#A84920) | MindKatha',
    description:
      'Meet Leona Lahkar (M.Sc. Clinical Psychology, PDCP, RCI Reg. #A84920), founder of MindKatha in Viman Nagar, Pune. Offering evidence-based, neuro-affirming, and queer-affirmative psychotherapy in English, Hindi, Assamese, and Bengali.',
    breadcrumbName: 'About Leona Lahkar',
    h1: 'Leona Lahkar — RCI-Licensed Clinical Psychologist (#A84920)',
    bodyHtml: `
      <p><strong>Leona Lahkar</strong> (M.Sc. Clinical Psychology &amp; Professional Diploma in Clinical Psychology, RCI Registration #A84920) leads clinical practice at MindKatha in Viman Nagar, Pune and via online video telehealth across India.</p>
      <p>She works with adults, couples, and neurodivergent clients navigating occupational burnout, anxiety, adult ADHD, relational patterns, and life transitions in <strong>English, Hindi, Assamese, and Bengali</strong>.</p>
      <blockquote>“Therapy is not about fixing a broken version of you. It is a calm, structured clinical space to understand your patterns and write your next chapter with clarity.”</blockquote>`
  },
  {
    slug: 'contact',
    title: 'Contact Viman Nagar Studio & Clinical FAQs | MindKatha Pune',
    description:
      'Visit the MindKatha clinical psychology studio at Disha Eternia, Sakore Nagar, Viman Nagar, Pune 411014, or connect via encrypted telehealth. Read answers to common questions on fees, insurance superbills, and intake sessions.',
    breadcrumbName: 'Contact & FAQs',
    h1: 'Connect with Clinical Care at MindKatha Pune',
    bodyHtml: `
      <p><strong>Pune Clinical Studio:</strong> 001, Ground Floor, Disha Eternia Society, Sakore Nagar, Viman Nagar, Pune, Maharashtra 411014.</p>
      <p><strong>Consultation Hours:</strong> 03:00 PM – 05:00 PM &amp; 07:00 PM – 09:00 PM IST (In-Person &amp; Encrypted Telehealth).</p>
      <p><strong>Practice Email:</strong> <a href="mailto:psychotherapy.leona@gmail.com">psychotherapy.leona@gmail.com</a></p>`
  },
  {
    slug: 'book',
    title: 'Book a Therapy Session or Free Discovery Call | MindKatha Pune',
    description:
      'Schedule a 50-minute clinical psychotherapy intake, Adult ADHD diagnostic evaluation, couples consultation, or complimentary discovery audio call with RCI-registered Clinical Psychologist Leona Lahkar.',
    breadcrumbName: 'Book a Session',
    h1: 'Book Your Clinical Psychotherapy Session or Free Discovery Call',
    bodyHtml: `
      <p>Select your preferred care pathway (Individual Psychotherapy, Adult ADHD Diagnostic Evaluation, Couples Mediation, Psychometric Assessment, or Complimentary Discovery Audio Call), choose between our Viman Nagar Pune studio or encrypted online video, and request an available IST slot with <strong>Leona Lahkar (RCI Reg. #A84920)</strong>.</p>`
  },
  {
    slug: 'legal',
    title: 'Legal, Privacy Policy & Clinical Informed Consent | MindKatha',
    description:
      'Review MindKatha ethical guidelines, DPDP Act 2023 data privacy protections, outpatient clinical informed consent, and 24-hour appointment cancellation policies.',
    breadcrumbName: 'Legal & Ethics',
    h1: 'Legal, Privacy & Clinical Informed Consent — MindKatha',
    bodyHtml: `
      <p>Ethical standards, client confidentiality under Rehabilitation Council of India (RCI) guidelines and the Digital Personal Data Protection Act (DPDP Act 2023), outpatient informed consent, and 24-to-48-hour appointment cancellation policies governing psychological services at MindKatha.</p>`
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy & DPDP Act 2023 Compliance | MindKatha',
    description:
      'How MindKatha protects your clinical confidentiality, session records, and encrypted telehealth consultations under RCI ethics and the Digital Personal Data Protection Act (DPDP Act 2023).',
    breadcrumbName: 'Privacy Policy',
    h1: 'Privacy Policy & Data Protection (DPDP Act 2023) — MindKatha',
    bodyHtml: `
      <p>At MindKatha, client confidentiality and personal data security are fundamental ethical principles. All digital intake forms, communication channels, and video telehealth platforms use encrypted transmission, and no personal or clinical data is ever shared with third-party advertisers or data brokers.</p>`
  },
  {
    slug: 'terms',
    title: 'Terms of Service & Cancellation Policy | MindKatha',
    description:
      'Outpatient practice policies, session duration, 24-to-48-hour rescheduling notice, direct self-pay billing, and insurance reimbursement superbills at MindKatha.',
    breadcrumbName: 'Terms & Policies',
    h1: 'Terms of Service & Practice Cancellation Policies — MindKatha',
    bodyHtml: `
      <p>Standard psychotherapy sessions are 50–60 minutes (60–75 minutes for couples therapy). We request a minimum of 24 to 48 hours notice for rescheduling or cancellation. Itemized clinical superbills are provided on request for private insurance reimbursement.</p>`
  },
  {
    slug: 'consent',
    title: 'Clinical Informed Consent & Ethical Scope | MindKatha',
    description:
      'Clinical informed consent framework for outpatient psychotherapy, telehealth privacy guidelines, and statutory limits of confidentiality at MindKatha Pune.',
    breadcrumbName: 'Informed Consent',
    h1: 'Clinical Informed Consent for Outpatient Psychotherapy — MindKatha',
    bodyHtml: `
      <p>MindKatha provides outpatient psychotherapy and diagnostic evaluations by RCI-registered Clinical Psychologist Leona Lahkar (#A84920). Information shared in therapy is strictly confidential under RCI ethical codes and Indian law.</p>`
  }
];

function escapeHtmlAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

for (const route of routes) {
  const canonicalUrl = `${baseUrl}/${route.slug}`;
  let html = baseHtml;

  // 1. Replace <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtmlAttr(route.title)}</title>`
  );

  // 2. Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${canonicalUrl}">`
  );

  // 3. Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeHtmlAttr(route.description)}">`
  );

  // 4. Replace OG & Twitter tags
  html = html.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${canonicalUrl}">`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${escapeHtmlAttr(route.title)}">`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${escapeHtmlAttr(route.description)}">`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${escapeHtmlAttr(route.title)}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${escapeHtmlAttr(route.description)}">`
  );

  // 5. Remove homepage-only hero image preloads on sub-routes to save bandwidth
  html = html.replace(/<link rel="preload" as="image"[^>]*>\s*/g, '');

  // 6. Replace BreadcrumbList JSON-LD schema with route-specific breadcrumb trail
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: route.breadcrumbName,
        item: canonicalUrl
      }
    ]
  };
  html = html.replace(
    /<script id="mk-breadcrumb-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="mk-breadcrumb-schema" type="application/ld+json">\n${JSON.stringify(breadcrumbSchema, null, 2)}\n  </script>`
  );

  // 7. Replace <app-root> static prerendered shell with route-specific semantic HTML
  const prerenderedMain = `<app-root>
    <main style="max-width:840px;margin:0 auto;padding:2.5rem 1.5rem;font-family:Inter,system-ui,sans-serif;color:#0f172a;line-height:1.6;">
      <nav aria-label="Breadcrumb" style="margin-bottom:1rem;font-size:0.85rem;">
        <a href="${baseUrl}/">Home</a> / <span>${escapeHtmlAttr(route.breadcrumbName)}</span>
      </nav>
      <nav aria-label="Primary Navigation" style="margin-bottom:1.5rem;font-size:0.875rem;">
        <a href="${baseUrl}/">Home</a> ·
        <a href="${baseUrl}/services">Services &amp; Specializations</a> ·
        <a href="${baseUrl}/about">About Leona Lahkar</a> ·
        <a href="${baseUrl}/contact">Contact &amp; FAQs</a> ·
        <a href="${baseUrl}/book">Book a Session</a> ·
        <a href="${baseUrl}/legal">Legal &amp; Privacy</a>
      </nav>
      <h1>${route.h1}</h1>
      ${route.bodyHtml}
      <aside aria-label="Clinical Author Bio" style="margin-top:2rem;padding-top:1rem;border-top:1px solid #e2e8f0;font-size:0.85rem;">
        <strong>Clinically Authored &amp; Reviewed by:</strong> <a href="${baseUrl}/about">Leona Lahkar</a>, RCI-Licensed Clinical Psychologist (RCI Reg. #A84920, M.Sc. Clinical Psychology &amp; PDCP).
      </aside>
    </main>
  </app-root>`;

  html = html.replace(/<app-root>[\s\S]*?<\/app-root>/, prerenderedMain);

  const routeDir = path.join(distBrowserDir, route.slug);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
  console.log(`Prerendered route: /${route.slug}/index.html`);
}

// Copy base index.html to 404.html for unknown deep-link fallback
fs.copyFileSync(baseIndexPath, path.join(distBrowserDir, '404.html'));
console.log('Generated fallback: /404.html');
