import React, { useEffect } from 'react';
import { CivicService } from '../types';
import {
  X,
  ShieldCheck,
  Clock,
  Banknote,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building,
  Info,
} from 'lucide-react';

interface ServiceModalProps {
  service: CivicService | null;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (service) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 dark:bg-black text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                {service.category}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" />
                <span>{service.department}</span>
              </span>
            </div>
            <h2 id="service-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {service.name}
            </h2>
            {service.hindiName && (
              <p className="text-xs text-slate-400">{service.hindiName}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300">
          {/* Fee & Timeline Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Statutory Fee</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{service.fee}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Processing Duration</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{service.processingTime}</span>
              </div>
            </div>
          </div>

          {/* Document Checklist (POI, POA, DOB, POR) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Mandatory & Supported Documents
              </h3>
            </div>
            <div className="space-y-2.5">
              {service.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      {doc.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{doc.description}</p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-950 p-2 rounded-lg">
                    <strong className="text-slate-700 dark:text-slate-300">Accepted proofs: </strong>
                    {doc.acceptedExamples.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step-by-Step Submission Workflow</span>
            </h3>
            <ol className="space-y-2 text-xs">
              {service.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Pre-Counter Caution & Guidance Tips */}
          {service.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs text-amber-950 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Pre-Counter Advisory Tips</span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {service.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Official Portal Link */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>CivicSaathi does not collect fees. Proceed to the official portal to apply.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              Close
            </button>
            <a
              href={service.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <span>Visit {service.officialPortalName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
