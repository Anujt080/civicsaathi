import { ComplaintCategory, ComplaintStatus, ServiceComplaint } from '../types';

const STORAGE_KEY = 'civicseva_service_complaints';

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  'Delay',
  'Rejection',
  'Status Issue',
  'Document Issue',
  'Payment Issue',
  'Incorrect Details',
  'Other',
];

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  'Submitted',
  'Under Review',
  'Action Required',
  'Resolved',
];

const INITIAL_MOCK_COMPLAINTS: ServiceComplaint[] = [
  {
    id: 'CMP-2026-1042',
    serviceId: 'aadhaar-update',
    serviceName: 'Aadhaar Update & Correction',
    category: 'Delay',
    description:
      'Demographic update submitted 22 days ago at Lok Seva Kendra. Standard turnaround was 15 days. Need status escalation.',
    referenceNumber: 'URN-9182-3847-1920',
    incidentDate: '2026-11-01',
    attachmentName: 'aadhaar_enrolment_slip.pdf',
    attachmentSize: 142000,
    status: 'Under Review',
    statusRemarks: 'Ticket logged with regional helpdesk. Scrutiny in progress.',
    createdAt: '2026-11-05T10:30:00.000Z',
    updatedAt: '2026-11-12T14:15:00.000Z',
  },
  {
    id: 'CMP-2026-1088',
    serviceId: 'dl-renewal',
    serviceName: 'Driving Licence Renewal',
    category: 'Status Issue',
    description:
      'Online portal shows pending document scrutiny despite all fee receipts cleared.',
    referenceNumber: 'CG04-2026-DL-9941',
    incidentDate: '2026-11-10',
    status: 'Action Required',
    statusRemarks: 'Medical certificate Form 1A scan was blurry. Please keep a fresh copy ready.',
    createdAt: '2026-11-14T09:20:00.000Z',
    updatedAt: '2026-11-18T16:00:00.000Z',
  },
];

/**
 * Retrieves complaints from localStorage, initializing with seed data if empty.
 */
export function getStoredComplaints(serviceId?: string): ServiceComplaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: ServiceComplaint[] = [];
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_COMPLAINTS));
      list = INITIAL_MOCK_COMPLAINTS;
    } else {
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed) ? parsed : INITIAL_MOCK_COMPLAINTS;
    }

    if (serviceId) {
      return list.filter((c) => c.serviceId === serviceId);
    }
    return list;
  } catch (err) {
    console.warn('Error reading complaints from localStorage:', err);
    return INITIAL_MOCK_COMPLAINTS;
  }
}

/**
 * Saves a new complaint to localStorage and returns the created record.
 */
export function saveComplaint(
  input: Omit<ServiceComplaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): ServiceComplaint {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const newComplaint: ServiceComplaint = {
    ...input,
    id: `CMP-2026-${rand}`,
    status: 'Submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusRemarks: 'Complaint received and logged into CivicSeva citizen tracker.',
  };

  try {
    const all = getStoredComplaints();
    const updated = [newComplaint, ...all];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error saving complaint to localStorage:', err);
  }

  return newComplaint;
}

/**
 * Removes a complaint by ID from localStorage.
 */
export function deleteComplaint(id: string): void {
  try {
    const all = getStoredComplaints();
    const filtered = all.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Error deleting complaint:', err);
  }
}
