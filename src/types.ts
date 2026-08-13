export interface LanguagePack {
  appName: string;
  appSubtitle: string;
  locationLabel: string;
  workingHours: string;
  heroTitle: string;
  heroSubtitle: string;
  freeDismantling: string;
  freePickup: string;
  bestRates: string;
  instantCash: string;
  trustedChoice: string;
  certifiedScales: string;
  quickQuoteBtn: string;
  callNowBtn: string;
  whatsAppBtn: string;
  
  // Section Titles
  servicesTitle: string;
  servicesSubtitle: string;
  estimatorTitle: string;
  estimatorSubtitle: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;

  // Reciprocity Highlights
  reciprocityTitle: string;
  reciprocityDesc: string;

  // Estimator Form
  stepLabel: string;
  selectCategory: string;
  selectQuantity: string;
  uploadPhoto: string;
  optionalPhoto: string;
  calculateValue: string;
  calculating: string;
  estimatorResultTitle: string;
  estimatedWeight: string;
  confidenceScore: string;
  estimatedValueSar: string;
  adviceLabel: string;
  nextStepsLabel: string;
  completeOnWhatsAppBtn: string;
  restartBtn: string;

  // Contact Form
  formName: string;
  formPhone: string;
  formDetails: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccess: string;
  formAddress: string;

  // Trust numbers
  happyCustomersCount: string;
  happyCustomersLabel: string;
  tonsRecycledCount: string;
  tonsRecycledLabel: string;
  experienceYearsCount: string;
  experienceYearsLabel: string;
}

export type MaterialType = 'ac' | 'copper' | 'iron' | 'aluminum' | 'electronics' | 'refrigerators';

export interface ScrapItemConfig {
  id: MaterialType;
  title: string;
  arabicTitle: string;
  subtitle: string;
  arabicSubtitle: string;
  rateEstimate: string;
  arabicRateEstimate: string;
  iconName: string;
  points: string[];
  arabicPoints: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  arabicName: string;
  location: string;
  arabicLocation: string;
  rating: number;
  text: string;
  arabicText: string;
  date: string;
}

export interface EstimationResult {
  detectedMaterials: string[];
  estimatedWeightKg: string;
  condition: string;
  confidence: number;
  estimatedValueRangeSar: string;
  professionalAdvice: string;
  nextSteps: string;
}
