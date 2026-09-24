export interface TherapyService {
  title: string;
  tag: string;
  description: string;
  duration: string;
  iconClass?: string;
}

export interface Modality {
  name: string;
  description: string;
  iconClass?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface Specialization {
  title: string;
  detailedDescription: string;
  icon?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category?: string;
  tag?: string;
  iconClass?: string;
  author?: string;
  authorTitle?: string;
  publishedDate?: string;
  content: string[];
  keyTakeaways?: string[];
}

export interface EmergencyHelpline {
  name: string;
  number: string;
  description: string;
  hours: string;
}
