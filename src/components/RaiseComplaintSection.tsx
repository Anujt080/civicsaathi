import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  X,
  Plus,
  History,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { ComplaintCategory, ComplaintStatus, ServiceComplaint } from '../types';
import { SERVICES_DATA } from '../data/services';
import {
  COMPLAINT_CATEGORIES,
  getStoredComplaints,
  saveComplaint,
  deleteComplaint,
} from '../services/complaintsService';

interface RaiseComplaintSectionProps {
  serviceId?: string;
  serviceName?: string;
  defaultReferenceNumber?: string;
  className?: string;
  externalTriggerOpen?: number;
}

export const RaiseComplaintSection: React.FC<RaiseComplaintSectionProps> = ({
  serviceId,
  serviceName,
  defaultReferenceNumber = '',
  className = '',
  externalTriggerOpen,
}) => {
  const [complaints, setComplaints] = useState<ServiceComplaint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(serviceId || '');
  const [category, setCategory] = useState<ComplaintCategory>('Delay');
  const [referenceNumber, setReferenceNumber] = useState<string>(defaultReferenceNumber);
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState<string>('');
  const [attachment, setAttachment] = useState<{ name: string; size: number } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Refresh complaints list
  const refreshComplaints = () => {
    const list = getStoredComplaints(serviceId);
    setComplaints(list);
  };

  useEffect(() => {
    refreshComplaints();
  }, [serviceId]);

  useEffect(() => {
    if (defaultReferenceNumber) {
      setReferenceNumber(defaultReferenceNumber);
    }
  }, [defaultReferenceNumber]);

  useEffect(() => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
  }, [serviceId]);

  useEffect(() => {
    if (externalTriggerOpen && externalTriggerOpen > 0) {
      if (defaultReferenceNumber) {
        setReferenceNumber(defaultReferenceNumber);
      }
      if (serviceId) {
        setSelectedServiceId(serviceId);
      }
      setFormError(null);
      setIsModalOpen(true);
    }
  }, [externalTriggerOpen, defaultReferenceNumber, serviceId]);

  const resolvedServiceName =
    serviceName ||
    SERVICES_DATA.find((s) => s.id === (serviceId || selectedServiceId))?.name ||
    'Citizen Public Service';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Attachment exceeds 5MB limit. Please upload a smaller document or scan.');
      return;
    }

    setAttachment({
      name: file.name,
      size: file.size,
    });
    setFormError(null);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleOpenModal = () => {
    setFormError(null);
    setSuccessMessage(null);
    if (!serviceId && !selectedServiceId && SERVICES_DATA.length > 0) {
      setSelectedServiceId(SERVICES_DATA[0].id);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const activeService = SERVICES_DATA.find((s) => s.id === (serviceId || selectedServiceId));
    const targetServiceId = serviceId || selectedServiceId;
    const targetServiceName = activeService?.name || resolvedServiceName;

    if (!targetServiceId) {
      setFormError('Please select a valid service for this complaint.');
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      setFormError('Please provide a detailed description (at least 15 characters).');
      return;
    }

    const created = saveComplaint({
      serviceId: targetServiceId,
      serviceName: targetServiceName,
      category,
      referenceNumber: referenceNumber.trim() || 'NOT_PROVIDED',
      incidentDate: incidentDate || new Date().toISOString().split('T')[0],
      description: description.trim(),
      attachmentName: attachment?.name,
      attachmentSize: attachment?.size,
    });

    refreshComplaints();
    setIsModalOpen(false);
    setDescription('');
    setAttachment(null);
    setShowHistory(true);
    setSuccessMessage(`Complaint ${created.id} registered successfully!`);
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this complaint record?')) {
      deleteComplaint(id);
      refreshComplaints();
    }
  };

  const renderStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Submitted
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Under Review
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            Action Required
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Resolved
          </span>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 flex items-center justify-between text-xs font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main "Facing an Issue? Raise a Complaint" Container */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 border border-amber-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Grievance & Issue Assistance</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Facing an Issue? Raise a Complaint
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Experiencing delays at the counter, rejected applications, status bottlenecks, or payment issues for{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{resolvedServiceName}</strong>? Log your complaint for structured tracking and escalation guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-xs shadow-xs hover:shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise a Complaint</span>
            </button>

            {complaints.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-2xs transition cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Track Complaints ({complaints.length})</span>
                {showHistory ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Advisory Notice */}
        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Advisory Notice:</strong> CivicSeva records complaints for local citizen reference, tracking, and advisory assistance. CivicSeva is not an official government adjudicator. For statutory government grievances, you can also register directly on official portals like{' '}
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              CPGRAMS <ExternalLink className="w-2.5 h-2.5" />
            </a>
            .
          </div>
        </div>

        {/* Complaint History Accordion / List */}
        {showHistory && complaints.length > 0 && (
          <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Logged Complaints & Statuses</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {complaints.length} {complaints.length === 1 ? 'case' : 'cases'} on record
              </span>
            </div>

            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-900 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-zinc-800">
                        {c.id}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
                        {c.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        • {c.serviceName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {renderStatusBadge(c.status)}
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                        title="Delete complaint entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-zinc-900">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>
                        App Ref: <strong className="font-mono text-slate-700 dark:text-slate-300">{c.referenceNumber}</strong>
                      </span>
                      <span>•</span>
                      <span>Date: {c.incidentDate}</span>
                      {c.attachmentName && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                            <FileText className="w-3 h-3" />
                            {c.attachmentName}
                          </span>
                        </>
                      )}
                    </div>

                    {c.statusRemarks && (
                      <span className="italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 px-2 py-0.5 rounded">
                        Note: {c.statusRemarks}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Raise a Complaint Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="complaint-modal-title"
        >
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Service Grievance Registry</span>
                </div>
                <h3 id="complaint-modal-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Raise a Complaint
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Log an issue for resolution tracking and escalation assistance
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition cursor-pointer"
                aria-label="Close complaint modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Error Notice */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Complaint Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Linked Service */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Linked Government Service
                </label>
                {serviceId ? (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{resolvedServiceName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      Auto-Linked
                    </span>
                  </div>
                ) : (
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Complaint Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    {COMPLAINT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Incident / Application Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              {/* Application / Reference Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Application / Reference Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. URN-2026-9941, Acknowledgement Slip No, or Token ID"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  Found on your printed facilitation slip, online portal SMS, or receipt.
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description of Issue <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail the issue faced at the facilitation counter or portal (e.g. officer rejected document despite meeting gazette checklist, server payment timed out, status delayed past SLA)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 resize-none"
                />
              </div>

              {/* Optional Attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Attachment (Receipt, Slip, or Error Screenshot)
                </label>
                {attachment ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate font-medium text-slate-900 dark:text-white">
                        {attachment.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({Math.round(attachment.size / 1024)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition cursor-pointer">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Upload receipt, slip, or screenshot
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      PDF, JPG, PNG up to 5MB
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm hover:shadow transition cursor-pointer"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
