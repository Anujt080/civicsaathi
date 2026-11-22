import { CivicIssueReport } from '../types';
import { INITIAL_MOCK_REPORTS } from '../data/reportsData';

const STORAGE_KEY = 'civicsaathi_reports';

/**
 * Retrieves all stored civic reports from localStorage, initialized with mock reports.
 */
export function getStoredReports(): CivicIssueReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REPORTS));
      return INITIAL_MOCK_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_MOCK_REPORTS;
  } catch (err) {
    console.warn('Error reading from localStorage, falling back to mock data:', err);
    return INITIAL_MOCK_REPORTS;
  }
}

/**
 * Saves a new report to localStorage (prepending it so newest appears first).
 */
export function saveNewReport(report: CivicIssueReport): CivicIssueReport[] {
  try {
    const existing = getStoredReports();
    const updated = [report, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Error saving report to localStorage:', err);
    return [report, ...INITIAL_MOCK_REPORTS];
  }
}

/**
 * Generates a mock report ID in the format CS-2026-XXXX.
 */
export function generateReportId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CS-2026-${rand}`;
}

/**
 * Formats an ISO date into a localized citizen-friendly date string.
 */
export function formatReportDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
