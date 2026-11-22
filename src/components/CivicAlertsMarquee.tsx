import React, { useState, useEffect } from 'react';
import { CIVIC_ALERTS } from '../data/alertsData';
import { Bell, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export const CivicAlertsMarquee: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % CIVIC_ALERTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeAlert = CIVIC_ALERTS[currentIdx];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Important':
        return 'bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300 border-red-200 dark:border-red-900';
      case 'Update':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      default:
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900';
    }
  };

  return (
    <section id="alerts" className="scroll-mt-24">
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden p-4 sm:p-5 transition">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Civic Bulletins & Statutory Advisories</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Official notices and procedural reminders from government ministries
              </p>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-2">
              {currentIdx + 1} / {CIVIC_ALERTS.length}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 transition"
              aria-label={isPaused ? 'Resume bulletin rotation' : 'Pause bulletin rotation'}
              title={isPaused ? 'Resume rotation' : 'Pause rotation'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setCurrentIdx((prev) => (prev - 1 + CIVIC_ALERTS.length) % CIVIC_ALERTS.length)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 transition"
              aria-label="Previous alert"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentIdx((prev) => (prev + 1) % CIVIC_ALERTS.length)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 transition"
              aria-label="Next alert"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Alert Display */}
        <div className="pt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(activeAlert.severity)}`}>
                {activeAlert.severity}: {activeAlert.category}
              </span>
              <span className="text-[11px] text-slate-400">Authority: {activeAlert.authority}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {activeAlert.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeAlert.description}
            </p>
          </div>

          <div className="text-[11px] text-slate-500 font-medium shrink-0 bg-slate-50 dark:bg-zinc-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-zinc-800">
            {activeAlert.effectiveDate}
          </div>
        </div>
      </div>
    </section>
  );
};
