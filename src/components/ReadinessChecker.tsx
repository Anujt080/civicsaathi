import React, { useState, useMemo } from 'react';
import { CIVIC_SERVICES } from '../data/servicesData';
import { CivicService } from '../types';
import {
  ApplicantProfile,
  PreparedDocument,
  verifyReadiness,
  ReadinessResult,
} from '../utils/verifierEngine';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Sparkles,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface ReadinessCheckerProps {
  initialServiceId?: string;
}

export const ReadinessChecker: React.FC<ReadinessCheckerProps> = ({
  initialServiceId,
}) => {
  // Service selection
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || 'passport-application'
  );

  const selectedService = useMemo<CivicService>(() => {
    return (
      CIVIC_SERVICES.find((s) => s.id === selectedServiceId) ||
      CIVIC_SERVICES[0]
    );
  }, [selectedServiceId]);

  // Applicant reference profile
  const [profile, setProfile] = useState<ApplicantProfile>({
    fullName: 'Rahul Sharma',
    dob: '1998-05-14',
    guardianName: 'Dinesh Sharma',
    state: 'Chhattisgarh',
    district: 'Durg',
  });

  // Prepared documents list
  const [documents, setDocuments] = useState<PreparedDocument[]>([
    {
      requirementId: 'doc-pass-poa',
      documentName: 'Aadhaar Card',
      category: 'POA',
      nameOnDocument: 'Rahul Sharma',
      isRecentBill: true,
      hasOriginalLaminated: false,
    },
    {
      requirementId: 'doc-pass-dob',
      documentName: 'Class 10th Certificate',
      category: 'DOB',
      nameOnDocument: 'Rahul Sharma',
      dobOnDocument: '1998-05-14',
      isRecentBill: true,
      hasOriginalLaminated: false,
    },
    {
      requirementId: 'doc-poi-id',
      documentName: 'PAN Card',
      category: 'POI',
      nameOnDocument: 'Rahul Sharma',
      isRecentBill: true,
      hasOriginalLaminated: false,
    },
  ]);

  // Document add form state
  const [newDocName, setNewDocName] = useState('Voter Identity Card');
  const [newDocCat, setNewDocCat] = useState<'POI' | 'POA' | 'DOB' | 'POR' | 'OTHER'>('POI');
  const [newDocPrintName, setNewDocPrintName] = useState(profile.fullName);

  // Compute live verification result
  const verificationResult: ReadinessResult = useMemo(() => {
    return verifyReadiness(selectedService, profile, documents);
  }, [selectedService, profile, documents]);

  // Handlers for document manipulation
  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocPrintName.trim()) return;

    setDocuments((prev) => [
      ...prev,
      {
        requirementId: `custom-${Date.now()}`,
        documentName: newDocName.trim(),
        category: newDocCat,
        nameOnDocument: newDocPrintName.trim(),
        isRecentBill: true,
        hasOriginalLaminated: false,
      },
    ]);

    setNewDocName('');
    setNewDocPrintName(profile.fullName);
  };

  // Demo Scenarios for 1-click evaluation
  const loadScenario = (type: 'PERFECT' | 'INITIAL_WARNING' | 'CRITICAL_MISMATCH') => {
    if (type === 'PERFECT') {
      setSelectedServiceId('passport-application');
      setProfile({
        fullName: 'Rahul Sharma',
        dob: '1998-05-14',
        guardianName: 'Dinesh Sharma',
        state: 'Chhattisgarh',
        district: 'Durg',
      });
      setDocuments([
        {
          requirementId: 'doc-1',
          documentName: 'Aadhaar Card',
          category: 'POA',
          nameOnDocument: 'Rahul Sharma',
          isRecentBill: true,
        },
        {
          requirementId: 'doc-2',
          documentName: '10th Standard Marksheet',
          category: 'DOB',
          nameOnDocument: 'Rahul Sharma',
          isRecentBill: true,
        },
        {
          requirementId: 'doc-3',
          documentName: 'PAN Card',
          category: 'POI',
          nameOnDocument: 'Rahul Sharma',
          isRecentBill: true,
        },
      ]);
    } else if (type === 'INITIAL_WARNING') {
      setSelectedServiceId('pan-card-services');
      setProfile({
        fullName: 'Priyanshu Pandey',
        dob: '2001-08-20',
        guardianName: 'Sunil Pandey',
        state: 'Chhattisgarh',
        district: 'Raipur',
      });
      setDocuments([
        {
          requirementId: 'doc-1',
          documentName: 'Aadhaar Card',
          category: 'POA',
          nameOnDocument: 'Priyanshu Pandey',
          isRecentBill: true,
        },
        {
          requirementId: 'doc-2',
          documentName: 'Voter ID Card',
          category: 'POI',
          nameOnDocument: 'P. Pandey', // Abbreviation
          isRecentBill: true,
        },
      ]);
    } else {
      setSelectedServiceId('passport-application');
      setProfile({
        fullName: 'Anita Verma',
        dob: '1995-11-03',
        guardianName: 'Ramesh Verma',
        state: 'Chhattisgarh',
        district: 'Bilaspur',
      });
      setDocuments([
        {
          requirementId: 'doc-1',
          documentName: 'Electricity Bill',
          category: 'POA',
          nameOnDocument: 'Anita Sharma', // Maiden surname mismatch
          isRecentBill: false, // > 3 months old
        },
        {
          requirementId: 'doc-2',
          documentName: 'PAN Card',
          category: 'POI',
          nameOnDocument: 'Anita Verma',
          isRecentBill: true,
        },
        // Missing statutory DOB proof
      ]);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40';
    return 'text-red-600 dark:text-red-400 border-red-500 bg-red-50 dark:bg-red-950/40';
  };

  return (
    <section id="readiness-checker" className="space-y-8 pt-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Tool • Pre-Counter Scrutiny</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Document Readiness & Discrepancy Verifier
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Simulate an official scrutiny check before you visit the counter. Cross-check your physical papers for name spelling variations, expired utility proofs, and statutory eligibility.
          </p>
        </div>

        {/* Demo Scenarios Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Try Demo Scenarios:</span>
          <button
            onClick={() => loadScenario('PERFECT')}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition"
          >
            Scenario A (Ready)
          </button>
          <button
            onClick={() => loadScenario('INITIAL_WARNING')}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition"
          >
            Scenario B (Advisory)
          </button>
          <button
            onClick={() => loadScenario('CRITICAL_MISMATCH')}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 transition"
          >
            Scenario C (Action Needed)
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Real-Time Audit on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Service Selection & Reference Profile */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-900">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                1. Target Service & Reference Application Details
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Service Select Dropdown */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  Select Government Service You Intend to Apply For:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {CIVIC_SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} ({srv.department})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Fee: <strong className="text-slate-700 dark:text-slate-300">{selectedService.fee}</strong> • Timeline: <strong className="text-slate-700 dark:text-slate-300">{selectedService.processingTime}</strong>
                </p>
              </div>

              {/* Reference Name & DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Applicant Full Name (As intended on new card):
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="e.g., Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Date of Birth (YYYY-MM-DD):
                  </label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Parent / Guardian Name:
                  </label>
                  <input
                    type="text"
                    value={profile.guardianName}
                    onChange={(e) => setProfile({ ...profile, guardianName: e.target.value })}
                    placeholder="e.g., Dinesh Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    District / Jurisdiction:
                  </label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    placeholder="e.g., Durg / Raipur"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Prepared Physical Documents */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  2. Physical Documents in Your Submission Folder
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {documents.length} Proofs Loaded
              </span>
            </div>

            {/* List of currently loaded documents */}
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        {doc.category}
                      </span>
                      <strong className="text-xs text-slate-900 dark:text-white">
                        {doc.documentName}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(idx)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 transition"
                      aria-label="Remove document"
                      title="Remove this document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                        Exact Name Printed on Document:
                      </label>
                      <input
                        type="text"
                        value={doc.nameOnDocument}
                        onChange={(e) => {
                          const updated = [...documents];
                          updated[idx].nameOnDocument = e.target.value;
                          setDocuments(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    {doc.category === 'POA' && (
                      <div className="flex items-center pt-5">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300">
                          <input
                            type="checkbox"
                            checked={doc.isRecentBill !== false}
                            onChange={(e) => {
                              const updated = [...documents];
                              updated[idx].isRecentBill = e.target.checked;
                              setDocuments(updated);
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Document issued within last 3 months</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddDocument} className="pt-2 border-t border-slate-100 dark:border-zinc-900 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                + Add Another Supporting Document:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Document Title (e.g. Voter ID)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <select
                    value={newDocCat}
                    onChange={(e) => setNewDocCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  >
                    <option value="POI">POI (Proof of Identity)</option>
                    <option value="POA">POA (Proof of Address)</option>
                    <option value="DOB">DOB (Proof of Birth)</option>
                    <option value="POR">POR (Proof of Relationship)</option>
                    <option value="OTHER">OTHER (Supplementary)</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={newDocPrintName}
                    onChange={(e) => setNewDocPrintName(e.target.value)}
                    placeholder="Name printed on this card"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 dark:bg-zinc-800 hover:bg-slate-900 dark:hover:bg-zinc-700 text-white text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Verification Deck</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Readiness Scorecard & Audit Report (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-zinc-950 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Counter Readiness Audit
                </h3>
              </div>
              <button
                onClick={() => loadScenario('PERFECT')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                title="Reset to default scenario"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Scorecard Gauge & Status */}
            <div className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${getScoreColor(verificationResult.score)}`}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">
                Estimated Counter Success Score
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight">
                {verificationResult.score}%
              </div>
              <div className="font-bold text-xs sm:text-sm">
                {verificationResult.statusLabel}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                {verificationResult.passedChecksCount} of {verificationResult.totalChecksCount} Statutory Verification Checks Passed
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  verificationResult.score >= 90
                    ? 'bg-emerald-500'
                    : verificationResult.score >= 70
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${verificationResult.score}%` }}
              />
            </div>

            {/* Audit Findings / Issues Feed */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Audit Feedback & Action Points ({verificationResult.issues.length})
              </h4>

              {verificationResult.issues.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No Discrepancies Detected</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Applicant name tokens, required document categories, and validity timelines align seamlessly with official {selectedService.department} guidelines.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {verificationResult.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        issue.type === 'CRITICAL'
                          ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
                          : issue.type === 'WARNING'
                          ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                          : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          {issue.type === 'CRITICAL' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <span>{issue.title}</span>
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-black border bg-white dark:bg-zinc-950">
                          {issue.type}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{issue.detail}</p>
                      <div className="text-[11px] pt-1 border-t border-slate-200/50 dark:border-zinc-800 font-medium">
                        <strong>Advice:</strong> {issue.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Print Slip Action CTA */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 space-y-2.5">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Civic Readiness Slip</span>
              </button>
              <a
                href={selectedService.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] text-blue-700 dark:text-blue-400 hover:underline py-1"
              >
                <span>Proceed to {selectedService.officialPortalName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
