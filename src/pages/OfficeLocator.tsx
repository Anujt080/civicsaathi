import React, { useState } from 'react';
import { OFFICES_DATA } from '../data/offices';
import { OfficeMap } from '../components/OfficeMap';
import { useTranslation } from '../context/LanguageContext';
import { MapPin, Building2 } from 'lucide-react';

export const OfficeLocator: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState(OFFICES_DATA[0]);
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-semibold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>{t('offices.title') || 'Nearby Seva Kendras'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('offices.findOfficeTitle') || 'Find Government Office'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('offices.subtitle') || 'Locate facilitation centers, opening hours, and distance.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          {OFFICES_DATA.map((office) => (
            <div
              key={office.id}
              onClick={() => setSelectedOffice(office)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                selectedOffice.id === office.id
                  ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/40 dark:border-blue-500 ring-2 ring-blue-600/20'
                  : 'bg-white dark:bg-black border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{office.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{office.address}</p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    {office.distanceKm} km
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2">
          <OfficeMap office={selectedOffice} />
        </div>
      </div>
    </div>
  );
};
