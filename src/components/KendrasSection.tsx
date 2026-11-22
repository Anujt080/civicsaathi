import React, { useState } from 'react';
import { SEVA_KENDRAS } from '../data/kendrasData';
import { SevaKendra } from '../types';
import { MapPin, Clock, Phone, ExternalLink, Navigation } from 'lucide-react';

export const KendrasSection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('All');

  const types = ['All', 'Aadhaar Seva Kendra', 'Passport Seva Kendra', 'Lok Seva Kendra', 'RTO Office'];

  const filtered = SEVA_KENDRAS.filter((k) => selectedType === 'All' || k.type === selectedType);

  return (
    <section id="kendras" className="space-y-6 pt-6 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5" />
            <span>Authorized Facilitation Centers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nearby Seva Kendras & Office Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Locate official facilitation centers, operating schedules, supported services, and direct navigation routes.
          </p>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                selectedType === t
                  ? 'bg-white dark:bg-zinc-800 text-blue-700 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Centers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((kendra: SevaKendra) => (
          <div
            key={kendra.id}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                  {kendra.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {kendra.name}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 px-2 py-1 rounded-md shrink-0">
                {kendra.district}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{kendra.address}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-zinc-900 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">{kendra.timing}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{kendra.phone}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500">Available Counters:</span>
              <div className="flex flex-wrap gap-1.5">
                {kendra.servicesAvailable.map((srv, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href={kendra.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
