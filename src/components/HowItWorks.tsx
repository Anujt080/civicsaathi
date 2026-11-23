import React from 'react';
import { FileSearch, CheckCircle2, Building2, ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: FileSearch,
      title: t('howItWorks.step1Title'),
      subtitle: t('howItWorks.step1Subtitle'),
      description: t('howItWorks.step1Desc'),
      color: 'blue',
      phaseText: t('howItWorks.phase1'),
    },
    {
      number: '02',
      icon: CheckCircle2,
      title: t('howItWorks.step2Title'),
      subtitle: t('howItWorks.step2Subtitle'),
      description: t('howItWorks.step2Desc'),
      color: 'emerald',
      phaseText: t('howItWorks.phase2'),
    },
    {
      number: '03',
      icon: Building2,
      title: t('howItWorks.step3Title'),
      subtitle: t('howItWorks.step3Subtitle'),
      description: t('howItWorks.step3Desc'),
      color: 'amber',
      phaseText: t('howItWorks.phase3'),
    },
  ];

  return (
    <section id="how-it-works" className="space-y-8 pt-8 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/60 inline-block">
          {t('howItWorks.badge')}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('howItWorks.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-4">
                {/* Step Top Header: Badge and Step Number */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      step.color === 'blue'
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400'
                        : step.color === 'emerald'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-zinc-800 tracking-tighter">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    {step.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress Connector Indicator */}
              <div className="pt-2 flex items-center text-xs font-semibold text-blue-700 dark:text-blue-400">
                <span>{step.phaseText}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 rtl-flip" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
