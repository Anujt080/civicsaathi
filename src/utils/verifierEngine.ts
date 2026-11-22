import { CivicService } from '../types';

export interface ApplicantProfile {
  fullName: string;
  dob: string;
  guardianName: string;
  state: string;
  district: string;
}

export interface PreparedDocument {
  requirementId: string;
  documentName: string;
  category: 'POI' | 'POA' | 'DOB' | 'POR' | 'OTHER';
  nameOnDocument: string;
  dobOnDocument?: string;
  isRecentBill?: boolean;
  hasOriginalLaminated?: boolean;
}

export interface VerificationIssue {
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  detail: string;
  recommendation: string;
}

export interface ReadinessResult {
  score: number;
  status: 'READY' | 'ADVISORY' | 'ACTION_REQUIRED';
  statusLabel: string;
  issues: VerificationIssue[];
  passedChecksCount: number;
  totalChecksCount: number;
}

const HONORIFICS = new Set([
  'MR',
  'MRS',
  'MS',
  'MISS',
  'SHRI',
  'SHREE',
  'SMT',
  'DR',
  'KUMAR',
  'KUMARI',
]);

/**
 * Normalizes name into uppercase tokens, stripping honorifics and punctuation.
 */
export function normalizeTokens(name: string): string[] {
  if (!name) return [];
  return name
    .toUpperCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 0 && !HONORIFICS.has(token));
}

/**
 * Compares reference name with document name.
 */
export function compareNames(
  refName: string,
  docName: string
): { status: 'EXACT' | 'PERMUTATION' | 'PARTIAL' | 'MISMATCH'; message: string } {
  const refTokens = normalizeTokens(refName);
  const docTokens = normalizeTokens(docName);

  if (refTokens.length === 0 || docTokens.length === 0) {
    return { status: 'MISMATCH', message: 'Name field is missing on this document.' };
  }

  const refJoined = refTokens.join(' ');
  const docJoined = docTokens.join(' ');

  // Exact match
  if (refJoined === docJoined) {
    return { status: 'EXACT', message: 'Name matches application record letter-for-letter.' };
  }

  // Permutation match (e.g. "Rahul Sharma" vs "Sharma Rahul")
  if (
    refTokens.length === docTokens.length &&
    [...refTokens].sort().join(' ') === [...docTokens].sort().join(' ')
  ) {
    return {
      status: 'PERMUTATION',
      message: 'Name word order differs (e.g. surname first). Acceptable with self-attestation.',
    };
  }

  // Partial match / Initial check (e.g. "R. Sharma" vs "Rahul Sharma")
  const isInitialMatch =
    (refTokens.length === docTokens.length &&
      refTokens.every((token, i) => {
        const docTok = docTokens[i];
        return token === docTok || token[0] === docTok[0];
      })) ||
    (docTokens.length > 0 &&
      refTokens.some((r) => docTokens.includes(r)));

  if (isInitialMatch) {
    return {
      status: 'PARTIAL',
      message: 'Initial or abbreviated name found. Bring an additional supporting photo ID.',
    };
  }

  return {
    status: 'MISMATCH',
    message: `Spelling mismatch between "${refName}" and "${docName}". High risk of counter rejection.`,
  };
}

/**
 * Calculates applicant age from date string (YYYY-MM-DD).
 */
export function calculateAge(dobStr: string): number | null {
  if (!dobStr) return null;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Runs complete pre-counter readiness check for selected service.
 */
export function verifyReadiness(
  service: CivicService,
  profile: ApplicantProfile,
  documents: PreparedDocument[]
): ReadinessResult {
  const issues: VerificationIssue[] = [];
  let score = 100;
  let passedChecks = 0;
  let totalChecks = 0;

  // 1. Check mandatory document coverage
  const requiredCategories = new Set(
    service.documents.filter((d: any) => d.required).map((d: any) => d.category)
  );

  const providedCategories = new Set(documents.map((d: any) => d.category));

  for (const reqCat of requiredCategories) {
    totalChecks++;
    if (!providedCategories.has(reqCat as any)) {
      issues.push({
        type: 'CRITICAL',
        title: `Missing ${reqCat} Document`,
        detail: `The selected service requires a valid ${reqCat} (Proof of ${
          reqCat === 'POI' ? 'Identity' : reqCat === 'POA' ? 'Address' : 'Date of Birth'
        }).`,
        recommendation: `Add an accepted ${reqCat} document (e.g., ${
          reqCat === 'POI'
            ? 'Voter ID, Passport, PAN'
            : reqCat === 'POA'
            ? 'Electricity Bill, Bank Passbook'
            : 'Birth Certificate, 10th Marksheet'
        }) before counter submission.`,
      });
      score -= 25;
    } else {
      passedChecks++;
    }
  }

  // 2. Check each document for name discrepancies
  for (const doc of documents) {
    totalChecks++;
    const nameCheck = compareNames(profile.fullName, doc.nameOnDocument);

    if (nameCheck.status === 'EXACT') {
      passedChecks++;
    } else if (nameCheck.status === 'PERMUTATION') {
      issues.push({
        type: 'INFO',
        title: `Name Order Variation on ${doc.documentName}`,
        detail: nameCheck.message,
        recommendation: 'Ensure your application form matches the first/last name sequence of your primary ID.',
      });
      score -= 5;
      passedChecks++;
    } else if (nameCheck.status === 'PARTIAL') {
      issues.push({
        type: 'WARNING',
        title: `Name Abbreviation on ${doc.documentName}`,
        detail: nameCheck.message,
        recommendation: 'Counters often ask for an extra government photo ID with your unabbreviated full name.',
      });
      score -= 15;
    } else {
      issues.push({
        type: 'CRITICAL',
        title: `Name Mismatch on ${doc.documentName}`,
        detail: nameCheck.message,
        recommendation: 'Counters will reject this document. Obtain an official correction or carry an affidavit.',
      });
      score -= 30;
    }

    // 3. Check utility bill age rule
    if (doc.category === 'POA' && doc.isRecentBill === false) {
      totalChecks++;
      issues.push({
        type: 'CRITICAL',
        title: `Utility Bill Outdated (>3 Months)`,
        detail: 'Statutory rules require electricity and water bills to be less than 3 months old.',
        recommendation: 'Download the latest electricity/water bill from your state distribution portal.',
      });
      score -= 20;
    } else if (doc.category === 'POA' && doc.isRecentBill === true) {
      totalChecks++;
      passedChecks++;
    }
  }

  // 4. Age Eligibility Check for specific services
  if (profile.dob) {
    totalChecks++;
    const age = calculateAge(profile.dob);

    if (service.id === 'driving-licence' && age !== null && age < 18) {
      issues.push({
        type: 'CRITICAL',
        title: 'Age Requirement Not Met',
        detail: `Driving Licence requires applicant to be at least 18 years old. Detected age: ${age} years.`,
        recommendation: 'Apply after reaching 18 years of age (or apply for gearless 50cc with parental consent at 16).',
      });
      score -= 40;
    } else if (service.id === 'social-pensions' && age !== null && age < 60) {
      issues.push({
        type: 'CRITICAL',
        title: 'Old Age Pension Age Threshold',
        detail: `National Old Age Pension (IGNOAPS) requires 60+ years. Detected age: ${age} years.`,
        recommendation: 'Ensure you meet the statutory 60+ year eligibility threshold before applying.',
      });
      score -= 40;
    } else {
      passedChecks++;
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let status: 'READY' | 'ADVISORY' | 'ACTION_REQUIRED' = 'READY';
  let statusLabel = 'Counter Ready';

  if (finalScore < 70 || issues.some((i) => i.type === 'CRITICAL')) {
    status = 'ACTION_REQUIRED';
    statusLabel = 'Action Required Prior to Counter Visit';
  } else if (finalScore < 90 || issues.some((i) => i.type === 'WARNING')) {
    status = 'ADVISORY';
    statusLabel = 'Minor Advisories Detected';
  }

  return {
    score: finalScore,
    status,
    statusLabel,
    issues,
    passedChecksCount: passedChecks,
    totalChecksCount: Math.max(totalChecks, 1),
  };
}
