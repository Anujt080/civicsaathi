import React from 'react';
import { ServiceCategory } from '../types';
import { SERVICE_CATEGORIES } from '../data/servicesData';
import { ServiceIcon } from './ServiceIcon';
import { Layers } from 'lucide-react';

interface ServiceCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const ServiceCategoryFilter: React.FC<ServiceCategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const allCategories = ['All', ...SERVICE_CATEGORIES];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800 focus:outline-none py-1">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'All' ? categoryCounts['All'] || 0 : categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              {cat === 'All' ? (
                <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
              ) : (
                <ServiceIcon
                  category={cat as ServiceCategory}
                  className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}
                />
              )}
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-blue-800/80 text-blue-100'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
