import React from 'react';
import { ShieldCheck, Eye, Compass, HeartHandshake } from 'lucide-react';

export const PillarsSection: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Prevention-First Design',
      description:
        'Over 35% of counter visits fail due to minor clerical mismatches like initials or unaccepted address proofs. CivicSaathi highlights inconsistencies before you visit the counter.',
    },
    {
      icon: Eye,
      title: 'Zero Commercial Tracking',
      description:
        'CivicSaathi does not monetize citizen data, run advertisements, or store your personal identity cards. All guidance and checklists run entirely in your browser.',
    },
    {
      icon: Compass,
      title: 'Official Gazette Grounding',
      description:
        'Checklists and procedures reflect authentic guidelines published by UIDAI, the Ministry of External Affairs, Income Tax Department, and State Revenue Departments.',
    },
    {
      icon: HeartHandshake,
      title: 'Inclusive & Accessible',
      description:
        'Engineered for every citizen with clean typography, high-contrast dark mode, mobile responsiveness, and multilingual Hindi & English context cues.',
    },
  ];

  return (
    <section className="space-y-6 pt-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          The Pillars of CivicSaathi
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Built as an independent, transparent civic-tech utility committed to public service transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-2xs space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
