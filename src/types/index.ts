export type DocumentCategory = 'POI' | 'POA' | 'DOB' | 'POR' | 'OTHER';

export interface DocumentRequirement {
  id: string;
  name: string;
  category: DocumentCategory;
  required: boolean;
  description: string;
  acceptedExamples: string[];
}

export type ServiceCategory =
  | 'Identity & Documents'
  | 'Education'
  | 'Health'
  | 'Government Schemes'
  | 'Transport'
  | 'Housing'
  | 'Employment'
  | 'Utilities';

export interface CivicService {
  id: string;
  name: string;
  hindiName?: string;
  category: ServiceCategory;
  department: string;
  officialPortalUrl: string;
  officialPortalName: string;
  fee: string;
  processingTime: string;
  summary: string;
  description: string;
  whoCanApply: string[];
  documents: DocumentRequirement[];
  steps: string[];
  importantInfo: string[];
  tips: string[];
  iconName?: string;
  isPopular?: boolean;
  tags?: string[];
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

// ==========================================
// CIVIC ISSUE REPORTING TYPES
// ==========================================

export type IssueCategory =
  | 'Roads & Potholes'
  | 'Streetlights'
  | 'Garbage & Sanitation'
  | 'Water Supply'
  | 'Public Buildings'
  | 'Drainage'
  | 'Other';

export type IssueUrgency = 'Low' | 'Medium' | 'High';

export type IssueStatus =
  | 'Submitted'
  | 'Under Review'
  | 'In Progress'
  | 'Resolved';

export interface IssueStatusUpdate {
  status: IssueStatus;
  timestamp: string;
  note: string;
}

export interface CivicIssueReport {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  urgency: IssueUrgency;
  status: IssueStatus;
  createdAt: string;
  photoUrl?: string;
  departmentAssigned?: string;
  statusUpdates?: IssueStatusUpdate[];
}
