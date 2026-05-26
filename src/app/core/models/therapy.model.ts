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
  title: string;
  excerpt: string;
  readTime: string;
}
