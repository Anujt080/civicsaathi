export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
  isConditional?: boolean;
  conditionNote?: string;
  acceptedExamples?: string[];
}

export interface ServiceStepDetail {
  step: number;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  fee: string;
  processingTime: string;
  requiredDocuments: DocumentRequirement[];
  steps: string[];
  stepDetails?: ServiceStepDetail[];
  eligibilitySummary?: string[];
  conditionalNotice?: string;
  officialPortalUrl?: string;
  officialPortalName?: string;
  officeAssistanceInfo?: string;
  importantNotes?: string[];
  disclaimer?: string;
  hasConditionalDocs?: boolean;
  isPopular?: boolean;
  shortDescription?: string;
  conciseFee?: string;
  conciseProcessingTime?: string;
}

export interface VerificationFieldCheck {
  fieldName: string;
  status: 'PASS' | 'WARNING' | 'ERROR' | 'INFO';
  extractedValue?: string;
  message: string;
}

export interface VerificationResult {
  serviceId: string;
  overallStatus: 'PASS' | 'WARNING' | 'ERROR' | 'NEEDS_REVIEW';
  totalDocuments: number;
  warningsCount: number;
  errorsCount: number;
  fieldChecks: VerificationFieldCheck[];
  extractedOcrData: Record<string, string>;
  isOcrProcessed?: boolean;
  ocrConfidence?: number;
  disclaimer?: string;
}

export type ApplicationStatus = 'In Progress' | 'Action Required' | 'Completed' | 'Pending Submission';

export interface Application {
  id: string;
  serviceId: string;
  serviceName: string;
  applicantName: string;
  currentStepIndex: number;
  status: ApplicationStatus;
  lastUpdated: string;
  verificationSummary?: {
    warnings: number;
    errors: number;
  };
}

export interface Office {
  id: string;
  name: string;
  serviceIds: string[];
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  phone: string;
  hours: string;
  isOpen: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
  errorCode?: string;
  model?: string;
  warningNote?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export type DocumentCategoryType =
  | 'Aadhaar Card'
  | 'PAN Card'
  | 'Driving Licence'
  | 'Voter ID'
  | 'Income Certificate'
  | 'Domicile Certificate'
  | 'Passport'
  | 'Proof of Address'
  | 'Proof of Identity'
  | 'Proof of Date of Birth'
  | 'Photograph'
  | 'Other';

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: DocumentCategoryType | string;
  file_name: string;
  storage_path: string;
  mime_type?: string;
  file_size?: number;
  verification_status: 'pending' | 'verified' | 'warning' | 'error';
  uploaded_at: string;
  updated_at?: string;
  file_url?: string;
  ocr_data?: Record<string, any>;
}

// =============================================================================
// CIVICSAATHI EXPLORER, ALERTS, & ISSUE REPORTING TYPES (Merged compatibility)
// =============================================================================

export type DocumentCategory = 'POI' | 'POA' | 'DOB' | 'POR' | 'OTHER' | string;

export type ServiceCategory =
  | 'Identity & Documents'
  | 'Education'
  | 'Health'
  | 'Government Schemes'
  | 'Transport'
  | 'Housing'
  | 'Employment'
  | 'Utilities'
  | string;

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
  type: 'Aadhaar Seva Kendra' | 'Passport Seva Kendra' | 'Lok Seva Kendra' | 'RTO Office' | string;
  district: string;
  address: string;
  timing: string;
  phone: string;
  servicesAvailable: string[];
  directionsUrl: string;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category: string;
}

export type IssueCategory =
  | 'Roads & Potholes'
  | 'Streetlights'
  | 'Garbage & Sanitation'
  | 'Water Supply'
  | 'Public Buildings'
  | 'Drainage'
  | 'Other'
  | string;

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

// =============================================================================
// SERVICE COMPLAINTS & GRIEVANCES TYPES
// =============================================================================

export type ComplaintCategory =
  | 'Delay'
  | 'Rejection'
  | 'Status Issue'
  | 'Document Issue'
  | 'Payment Issue'
  | 'Incorrect Details'
  | 'Other';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Action Required'
  | 'Resolved';

export interface ServiceComplaint {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ComplaintCategory;
  description: string;
  referenceNumber: string;
  incidentDate: string;
  attachmentName?: string;
  attachmentSize?: number;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  statusRemarks?: string;
}
