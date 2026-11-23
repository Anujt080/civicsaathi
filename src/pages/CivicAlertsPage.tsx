import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CIVIC_ALERTS } from '../data/alertsData';
import { CivicAlert } from '../types';
import {
  Bell,
  Search,
  Filter,
  Calendar,
  Building,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Info,
} from 'lucide-react';

export const CivicAlertsPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Aadhaar Update', 'PAN-Aadhaar', 'Passport Seva', 'Transport (Parivahan)'];
  const severities = ['All', 'Important', 'Advisory', 'Update'];

  const filteredAlerts = CIVIC_ALERTS.filter((alert: CivicAlert) => {
    const matchesSearch =
      searchKeyword.trim() === '' ||
      alert.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      alert.authority.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesSeverity = selectedSeverity === 'All' || alert.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'All' || alert.category === selectedCategory;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Important':
        return {
          badge: 'bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 border-red-200 dark:border-red-900',
          dot: 'bg-red-500',
        };
      case 'Update':
        return {
          badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-900',
          dot: 'bg-blue-500',
        };
      default:
        return {
          badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900',
          dot: 'bg-amber-500',
        };
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link
            to="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200">Civic Alerts</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/60 inline-flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Gazette Notices & Procedural Advisories</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Civic Bulletins & Statutory Advisories
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time official notices, regulatory deadlines, and procedural updates issued by
              UIDAI, the Ministry of External Affairs, MoRTH, and the Income Tax Department.
            </p>
          </div>

          {/* Active Live Pulse Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-2 rounded-2xl self-start md:self-auto shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="text-left">
              <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                Official Channels Monitored
              </p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                Updated with current ministerial drives
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Keyword Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search bulletins by title, authority (e.g. UIDAI, MoRTH), or keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-900">
          {/* Severity Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Severity:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {severities.map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSeverity === sev
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              Department:
            </span>
            <div className="flex items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-800 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-2xs'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredAlerts.length}</strong> active bulletin
            {filteredAlerts.length === 1 ? '' : 's'}
          </span>
          {(searchKeyword || selectedSeverity !== 'All' || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedSeverity('All');
                setSelectedCategory('All');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No bulletins match your filter criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or resetting the severity and department filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAlerts.map((alert) => {
              const style = getSeverityStyle(alert.severity);

              return (
                <div
                  key={alert.id}
                  className="rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between space-y-5 hover:border-slate-300 dark:hover:border-zinc-700 transition"
                >
                  <div className="space-y-3.5">
                    {/* Header Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          <span>{alert.severity}</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-zinc-800">
                          {alert.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{alert.authority}</span>
                      </span>
                    </div>

                    {/* Alert Title */}
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {alert.title}
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {alert.description}
                    </p>

                    {/* Actionable Citizen Takeaway */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Citizen Action Recommended</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Verify your documents before counter visits. Use our Document Readiness Checker to ensure zero spelling discrepancies.
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.effectiveDate}</span>
                    </span>

                    <Link
                      to="/#readiness-checker"
                      className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                    >
                      <span>Verify Readiness</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Statutory Guidance Box */}
      <section className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Official Source Attribution & Citizen Safety Notice
          </h3>
          <p>
            CivicSeva aggregates regulatory updates directly from official gazette notifications and ministry
            press releases. Government authorities never request OTPs, ATM PINs, or biometric captures via phone
            calls or unverified links. Always ensure you are on authentic <code>.gov.in</code> or <code>.nic.in</code> domains.
          </p>
        </div>
      </section>
    </div>
  );
};
