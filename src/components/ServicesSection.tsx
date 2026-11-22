import React, { useState, useMemo } from 'react';
import { CivicService } from '../types';
import { CIVIC_SERVICES } from '../data/servicesData';
import { ServiceCard } from './ServiceCard';
import { Search, Filter, Layers } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: CivicService) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES = [
  'All',
  'Identity',
  'Travel',
  'Transport',
  'Certificates',
  'Welfare',
] as const;

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredServices = useMemo(() => {
    return CIVIC_SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        (service.hindiName && service.hindiName.toLowerCase().includes(q)) ||
        service.summary.toLowerCase().includes(q) ||
        service.department.toLowerCase().includes(q) ||
        service.documents.some((d) => d.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="services" className="space-y-6 pt-6 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md">
            <Layers className="w-3.5 h-3.5" />
            <span>Public Services Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Government Services & Document Checklists
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Select a public service to view verified statutory rules, mandatory proof lists, fee tables, and pre-counter instructions.
          </p>
        </div>

        {/* Dynamic Service Count Pill */}
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 self-start md:self-auto shrink-0">
          Showing <strong className="text-blue-700 dark:text-blue-400 font-bold">{filteredServices.length}</strong> of {CIVIC_SERVICES.length} Services
        </div>
      </div>

      {/* Filter Toolbar (Categories + Search) */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xs space-y-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Filter Query Status */}
        {searchQuery && (
          <div className="flex items-center justify-between text-xs bg-blue-50/70 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
            <span>
              Filtered by search: <strong>"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => onSearchChange('')}
              className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Service Cards Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-white">No matching public services found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We couldn't find services matching "{searchQuery}". Try searching for generic terms like "Aadhaar", "Passport", "Licence", or "Certificate".
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setSelectedCategory('All');
            }}
            className="text-xs font-semibold px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition"
          >
            Clear Filters & Show All
          </button>
        </div>
      )}
    </section>
  );
};
