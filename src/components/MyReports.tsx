import React, { useState, useMemo } from 'react';
import { CivicIssueReport, IssueStatus } from '../types';
import { getStoredReports, formatReportDate } from '../utils/reportsStorage';
import {
  FileText,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock4,
  PlusCircle,
  Building,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';

interface MyReportsProps {
  onReportNewIssue: () => void;
  onReturnHome: () => void;
}

const STATUS_OPTIONS: Array<'All' | IssueStatus> = [
  'All',
  'Submitted',
  'Under Review',
  'In Progress',
  'Resolved',
];

export const MyReports: React.FC<MyReportsProps> = ({
  onReportNewIssue,
  onReturnHome,
}) => {
  const [reports, setReports] = useState<CivicIssueReport[]>(() => getStoredReports());
  const [selectedStatus, setSelectedStatus] = useState<'All' | IssueStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: reports.length,
      Submitted: 0,
      'Under Review': 0,
      'In Progress': 0,
      Resolved: 0,
    };
    for (const r of reports) {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    }
    return counts;
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus =
        selectedStatus === 'All' || report.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        report.id.toLowerCase().includes(q) ||
        report.title.toLowerCase().includes(q) ||
        report.category.toLowerCase().includes(q) ||
        report.location.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [reports, selectedStatus, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedReportId((prev) => (prev === id ? null : id));
  };

  const handleRefresh = () => {
    setReports(getStoredReports());
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={onReturnHome}
              className="hover:text-blue-700 dark:hover:text-blue-400 transition"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">My Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Civic Reports & Grievances
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track status updates, departmental actions, and resolution timelines for your submitted community grievances.
          </p>
        </div>

        {/* Action Button: Report New Issue */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 transition"
            title="Refresh reports"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onReportNewIssue}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report New Issue</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Report ID (e.g. CS-2026-4821), issue title, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Status:</span>
          </span>
          {STATUS_OPTIONS.map((status) => {
            const isSelected = selectedStatus === status;
            const count = statusCounts[status] || 0;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-blue-800/80 text-blue-100'
                      : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports List or Empty State */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isExpanded = expandedReportId === report.id;
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-zinc-700 space-y-4"
              >
                {/* Header: ID, Category, Urgency, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-zinc-800">
                      {report.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                      {report.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        report.urgency === 'High'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : report.urgency === 'Medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                      }`}
                    >
                      {report.urgency} Priority
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <StatusBadge status={report.status} />
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {report.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {/* Optional Attached Photo Thumbnail */}
                {report.photoUrl && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 w-fit">
                    <img
                      src={report.photoUrl}
                      alt={report.title}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-zinc-750 shrink-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Attached Photo Evidence</span>
                      </span>
                      <a
                        href={report.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Full Image
                      </a>
                    </div>
                  </div>
                )}

                {/* Location & Metadata Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{report.location}</span>
                    </span>
                    {report.coordinates && (
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded">
                        {report.coordinates.latitude}° N, {report.coordinates.longitude}° E
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatReportDate(report.createdAt)}</span>
                    </span>

                    {/* Toggle Timeline Button */}
                    {report.statusUpdates && report.statusUpdates.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(report.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Timeline' : 'View Timeline'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Progress Timeline */}
                {isExpanded && report.statusUpdates && (
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-900 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Departmental Action Timeline
                      </span>
                      {report.departmentAssigned && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{report.departmentAssigned}</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 relative pl-4 border-l-2 border-slate-200 dark:border-zinc-800 ml-2">
                      {report.statusUpdates.map((update, idx) => (
                        <div key={idx} className="relative space-y-0.5">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white dark:border-black" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {update.status}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatReportDate(update.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                            {update.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900/60">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              {reports.length === 0 ? 'No Civic Reports Found' : 'No Matching Reports'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {reports.length === 0
                ? "You haven't logged any civic grievances yet. Spot an issue in your neighborhood? Report it right away."
                : `We couldn't find any reports with status "${selectedStatus}"${searchQuery ? ` matching "${searchQuery}"` : ''}.`}
            </p>
          </div>

          <div className="pt-2">
            {reports.length === 0 || selectedStatus !== 'All' ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition mr-2"
              >
                <span>Reset Filters</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={onReportNewIssue}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function StatusBadge({ status }: { status: IssueStatus }) {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <Clock4 className="w-3 h-3 text-blue-600" />
          <span>Submitted</span>
        </span>
      );
    case 'Under Review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
          <AlertCircle className="w-3 h-3 text-purple-600" />
          <span>Under Review</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
          <span>In Progress</span>
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Resolved</span>
        </span>
      );
  }
}
