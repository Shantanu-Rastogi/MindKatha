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
