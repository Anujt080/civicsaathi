import { CivicIssueReport, IssueCategory } from '../types';

export const ISSUE_CATEGORIES: IssueCategory[] = [
  'Roads & Potholes',
  'Streetlights',
  'Garbage & Sanitation',
  'Water Supply',
  'Public Buildings',
  'Drainage',
  'Other',
];

export const INITIAL_MOCK_REPORTS: CivicIssueReport[] = [
  {
    id: 'CS-2026-4821',
    title: 'Deep pothole cluster causing two-wheeler skids',
    category: 'Roads & Potholes',
    description: 'Multiple deep potholes right after the monsoon shower near the central junction. Several commuters on two-wheelers have lost balance during peak morning traffic hours.',
    location: 'Sector 4 Main Market Road, opposite Shanti Niketan School, Raipur',
    coordinates: {
      latitude: 21.2514,
      longitude: 81.6296,
    },
    urgency: 'High',
    status: 'In Progress',
    createdAt: '2026-11-20T09:30:00Z',
    departmentAssigned: 'Municipal Road Maintenance & PWD Wing',
    statusUpdates: [
      {
        status: 'Submitted',
        timestamp: '2026-11-20T09:30:00Z',
        note: 'Grievance ticket created by citizen with GPS location tag.',
      },
      {
        status: 'Under Review',
        timestamp: '2026-11-20T14:15:00Z',
        note: 'Assigned to Ward Junior Engineer (Roads) for site inspection.',
      },
      {
        status: 'In Progress',
        timestamp: '2026-11-21T11:00:00Z',
        note: 'Bitumen cold mix patching material dispatched; repair crew on site.',
      },
    ],
  },
  {
    id: 'CS-2026-3914',
    title: 'Non-functional streetlights along residential lane',
    category: 'Streetlights',
    description: 'Three consecutive streetlights have been completely dark for over four days, causing severe safety concerns for pedestrians and evening walkers.',
    location: 'Lane 7, Krishna Nagar, near Community Hall, Durg',
    coordinates: {
      latitude: 21.1904,
      longitude: 81.2849,
    },
    urgency: 'Medium',
    status: 'Under Review',
    createdAt: '2026-11-21T18:45:00Z',
    departmentAssigned: 'Electrical Works & Streetlighting Cell',
    statusUpdates: [
      {
        status: 'Submitted',
        timestamp: '2026-11-21T18:45:00Z',
        note: 'Citizen report logged with pole number details.',
      },
      {
        status: 'Under Review',
        timestamp: '2026-11-22T10:00:00Z',
        note: 'Work order queued for LED driver unit replacement.',
      },
    ],
  },
  {
    id: 'CS-2026-2760',
    title: 'Overflowing public community waste container',
    category: 'Garbage & Sanitation',
    description: 'The green community dump bin has not been cleared for over 48 hours and waste is spilling over onto the pedestrian walkway, attracting stray animals.',
    location: 'Ward 12 Vegetable Market Corner, G.E. Road, Bilaspur',
    coordinates: {
      latitude: 22.0797,
      longitude: 82.1409,
    },
    urgency: 'Medium',
    status: 'Resolved',
    createdAt: '2026-11-18T07:15:00Z',
    departmentAssigned: 'Solid Waste Management & Public Health',
    statusUpdates: [
      {
        status: 'Submitted',
        timestamp: '2026-11-18T07:15:00Z',
        note: 'Sanitation grievance registered with photo evidence.',
      },
      {
        status: 'Under Review',
        timestamp: '2026-11-18T08:30:00Z',
        note: 'Notified Sanitary Inspector of Ward 12.',
      },
      {
        status: 'In Progress',
        timestamp: '2026-11-18T10:00:00Z',
        note: 'Compactor vehicle deployed to clear dump site.',
      },
      {
        status: 'Resolved',
        timestamp: '2026-11-18T12:30:00Z',
        note: 'Site cleared and sanitized with lime powder. Action verified.',
      },
    ],
  },
  {
    id: 'CS-2026-1502',
    title: 'Continuous potable water pipeline leak',
    category: 'Water Supply',
    description: 'Main municipal feeder supply pipe is bursting at the joint, resulting in heavy loss of clean drinking water and flooding the roadside drain.',
    location: 'Opposite Subhash Chandra Bose Park, Civil Lines, Raipur',
    coordinates: {
      latitude: 21.2405,
      longitude: 81.6364,
    },
    urgency: 'High',
    status: 'Submitted',
    createdAt: '2026-11-22T14:20:00Z',
    departmentAssigned: 'Public Health Engineering Department (PHED)',
    statusUpdates: [
      {
        status: 'Submitted',
        timestamp: '2026-11-22T14:20:00Z',
        note: 'Emergency pipeline repair ticket generated.',
      },
    ],
  },
  {
    id: 'CS-2026-0845',
    title: 'Open storm drain slab broken near primary school',
    category: 'Drainage',
    description: 'Heavy RCC concrete drain cover slab broke after a truck drove over it. An open gap of 3 feet exists directly adjacent to school footpath.',
    location: 'Govt Higher Secondary School Gate, Station Road, Rajnandgaon',
    coordinates: {
      latitude: 21.0974,
      longitude: 81.0354,
    },
    urgency: 'High',
    status: 'Resolved',
    createdAt: '2026-11-15T11:00:00Z',
    departmentAssigned: 'Municipal Drainage & Civil Works',
    statusUpdates: [
      {
        status: 'Submitted',
        timestamp: '2026-11-15T11:00:00Z',
        note: 'Hazardous drain gap reported.',
      },
      {
        status: 'In Progress',
        timestamp: '2026-11-15T14:00:00Z',
        note: 'Barricading installed and replacement RCC slab cast.',
      },
      {
        status: 'Resolved',
        timestamp: '2026-11-16T16:00:00Z',
        note: 'New reinforced slab installed and tested.',
      },
    ],
  },
];
