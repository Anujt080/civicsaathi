import React from 'react';
import { CivicService } from '../types';
import { ServiceIcon } from './ServiceIcon';
import { Banknote, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: CivicService;
  onSelect: (service: CivicService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div className="group relative bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between h-full transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-lg hover:-translate-y-0.5">
      <div className="space-y-4">
        {/* Top Header: Simple Icon + Category Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <ServiceIcon
                iconName={service.iconName}
                category={service.category}
                className="w-4 h-4"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200/70 dark:border-blue-900/60">
              {service.category}
            </span>
          </div>

          {service.isPopular && (
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>High Priority</span>
            </span>
          )}
        </div>

        {/* Service Name & Hindi Subtitle */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {service.name}
          </h3>
          {service.hindiName && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {service.hindiName}
            </p>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {service.summary}
        </p>

        {/* Required Proofs Badges */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Required Proofs:</span>
            <span>{service.documents.length} statutory proofs</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {service.documents.map((doc) => (
              <span
                key={doc.id}
                className="text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700"
              >
                {doc.category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata and "View Details" button */}
      <div className="pt-4 mt-5 border-t border-slate-100 dark:border-zinc-900 space-y-3.5">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">
              Fee: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{service.fee}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">
              Time: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{service.processingTime}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(service)}
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-xs group-hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
