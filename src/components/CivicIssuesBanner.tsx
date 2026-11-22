import React from 'react';
import { ShieldAlert, ArrowRight, Camera, FileText, CheckCircle2 } from 'lucide-react';

interface CivicIssuesBannerProps {
  onReportIssue: () => void;
  onViewMyReports: () => void;
}

export const CivicIssuesBanner: React.FC<CivicIssuesBannerProps> = ({
  onReportIssue,
  onViewMyReports,
}) => {
  return (
    <section className="relative rounded-3xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 overflow-hidden shadow-md">
      {/* Background Glow Accents */}
      <div
        className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            <span>Civic Issue Reporting</span>
            <span className="text-blue-200/40">•</span>
            <span className="text-emerald-300 font-semibold">Community Action</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
            Spot an issue in your neighborhood? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-emerald-300 to-teal-200">
              Report it in 60 seconds.
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Hazardous potholes, non-functional streetlights, water pipeline leaks, or overflowing garbage. Submit reports with geotagged locations and track progress through resolution.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location Geotagging</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Evidence Photo Upload</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Status Tracking</span>
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={onReportIssue}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition hover:shadow-lg cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Report an Issue Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onViewMyReports}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer backdrop-blur-xs"
          >
            <FileText className="w-4 h-4 text-slate-300" />
            <span>View My Submitted Reports</span>
          </button>
        </div>
      </div>
    </section>
  );
};
