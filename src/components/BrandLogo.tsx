import React from 'react';

interface BrandLogoProps {
  lightText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  lightText = false,
  size = 'md',
  showSubtitle = false,
}) => {
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl';
  const subTextSize = size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Civic Emblem Shield */}
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
        <div className={`${
          size === 'lg' ? 'w-11 h-11' : size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'
        } rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-emerald-600 p-0.5 shadow-md flex items-center justify-center`}>
          <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[10px] flex items-center justify-center p-1">
            <img
              src="/logo.png"
              alt="CivicSaathi Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Graceful fallback if image is not loaded
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-black ${textSize} tracking-tight ${
            lightText ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          Civic<span className="text-emerald-600 dark:text-emerald-400">Saathi</span>
        </span>
        {showSubtitle && (
          <span
            className={`font-medium ${subTextSize} tracking-wider uppercase mt-1 ${
              lightText ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Citizen Guidance Platform
          </span>
        )}
      </div>
    </div>
  );
};
