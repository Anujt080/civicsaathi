export interface DocumentRequirement {
  id: string;
  name: string;
  category: 'POI' | 'POA' | 'DOB' | 'POR' | 'OTHER';
  required: boolean;
  description: string;
  acceptedExamples: string[];
}

export interface CivicService {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Identity' | 'Welfare' | 'Transport' | 'Certificates' | 'Civil' | 'Travel';
  department: string;
  officialPortalUrl: string;
  officialPortalName: string;
  fee: string;
  processingTime: string;
  summary: string;
  isPopular?: boolean;
  documents: DocumentRequirement[];
  steps: string[];
  tips: string[];
}

export interface CivicAlert {
  id: string;
  category: string;
  severity: 'Important' | 'Update' | 'Advisory';
  title: string;
  description: string;
  effectiveDate: string;
  authority: string;
}

export interface SevaKendra {
  id: string;
  name: string;
  type: 'Aadhaar Seva Kendra' | 'Passport Seva Kendra' | 'Lok Seva Kendra' | 'RTO Office';
  district: string;
  address: string;
  timing: string;
  phone: string;
  servicesAvailable: string[];
  directionsUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
