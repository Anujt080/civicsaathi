import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FaqItem } from '../types';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'General',
      question: 'Is CivicSaathi an official government website?',
      answer:
        'No. CivicSaathi is an independent, non-commercial civic-tech guidance platform. We do not issue government documents, collect statutory fees, or approve applications. We empower citizens with clear checklists, consistency checking, and direct links to authentic government portals.',
    },
    {
      id: 'faq-2',
      category: 'Fees',
      question: 'Does CivicSaathi charge any fees for using the platform?',
      answer:
        'No. CivicSaathi is completely free to use for all citizens. Any fees mentioned on service cards (such as ₹50 for Aadhaar demographic update or ₹1,500 for normal passport) are official statutory government fees payable directly to authorized government departments.',
    },
    {
      id: 'faq-3',
      category: 'Applications',
      question: 'Can I submit my passport, Aadhaar, or driving licence application directly here?',
      answer:
        'No. Statutory applications must be submitted through their designated official websites (such as uidai.gov.in, passportindia.gov.in, or parivahan.gov.in) or at an authorized facilitation center. CivicSaathi provides verified document checklists and direct portal links once your papers are counter-ready.',
    },
    {
      id: 'faq-4',
      category: 'Privacy',
      question: 'Are my personal documents or information stored on your servers?',
      answer:
        'No. CivicSaathi adheres to strict privacy-by-design principles. We do not record your personal information, Aadhaar numbers, or financial details. Everything you browse runs locally in your web browser.',
    },
    {
      id: 'faq-5',
      category: 'Kendras',
      question: 'How do I locate the nearest government facilitation counter?',
      answer:
        'Use our Authorized Facilitation Centers directory on this page or search by district to view addresses, operational hours, helpline numbers, and direct navigation links.',
    },
  ];

  return (
    <section id="faq" className="space-y-6 pt-6 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Common Questions & Guidance
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Everything you need to know about CivicSaathi, document preparedness, and public service workflows.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xs transition"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : (faq.id || null))}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    {faq.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                <div className="p-1 rounded-lg bg-slate-50 dark:bg-zinc-900 text-slate-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-zinc-900 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
