import { CivicAlert } from '../types';

export const CIVIC_ALERTS: CivicAlert[] = [
  {
    id: 'alert-1',
    category: 'Aadhaar Update',
    severity: 'Important',
    title: 'UIDAI Free Document Re-Validation Advisory',
    description: 'Citizens holding Aadhaar cards issued over 10 years ago are advised to update their POI & POA proofs online for seamless verification.',
    effectiveDate: 'Active Nationwide',
    authority: 'UIDAI',
  },
  {
    id: 'alert-2',
    category: 'PAN-Aadhaar',
    severity: 'Advisory',
    title: 'Demographic Spelling Consistency Check',
    description: 'Ensure exact letter-for-letter name and DOB match between PAN records and Aadhaar to prevent banking and tax refund delays.',
    effectiveDate: 'Ongoing Guideline',
    authority: 'Income Tax Dept',
  },
  {
    id: 'alert-3',
    category: 'Passport Seva',
    severity: 'Update',
    title: 'Pre-Scheduled PSK Online Appointment Requirement',
    description: 'All regional Passport Seva Kendras (PSK) and Post Office PSKs require prior token booking online. Walk-in slots are restricted to senior citizens and urgent medical cases.',
    effectiveDate: 'Ministry Advisory',
    authority: 'MEA India',
  },
  {
    id: 'alert-4',
    category: 'Transport (Parivahan)',
    severity: 'Update',
    title: 'Contactless Learner Licence Online Facility',
    description: 'Applicants with Aadhaar-authenticated mobile numbers can take their online computer test from home in participating states without visiting the RTO.',
    effectiveDate: 'Digital India Drive',
    authority: 'MoRTH',
  },
];
