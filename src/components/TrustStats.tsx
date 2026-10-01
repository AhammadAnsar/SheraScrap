import React from 'react';
import { Award, ShieldCheck, Users } from 'lucide-react';
import { LanguagePack } from '../types';

interface TrustStatsProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function TrustStats({ lang, t }: TrustStatsProps) {
  const isRtl = lang === 'ar';

  return (
    <section className="w-full bg-slate-900 text-white py-10 px-4 relative overflow-hidden" id="trust-stats">
      {/* Dynamic graphic accent line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4">
        {/* Stat Item 1 */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-emerald-400 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <span className="block text-2xl md:text-3xl font-black text-white tracking-tight">5,000+</span>
            <span className="text-xs md:text-sm text-slate-400 font-bold">{t.happyCustomersLabel}</span>
          </div>
        </div>

        {/* Separator line */}
        <div className="hidden md:block h-12 w-[1px] bg-slate-800" />

        {/* Stat Item 2 */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-emerald-400 shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <span className="block text-2xl md:text-3xl font-black text-emerald-400 tracking-tight">10,000+</span>
            <span className="text-xs md:text-sm text-slate-400 font-bold">{t.tonsRecycledLabel}</span>
          </div>
        </div>

        {/* Separator line */}
        <div className="hidden md:block h-12 w-[1px] bg-slate-800" />

        {/* Stat Item 3 */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-emerald-400 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <span className="block text-2xl md:text-3xl font-black text-white tracking-tight">20+</span>
            <span className="text-xs md:text-sm text-slate-400 font-bold">{t.experienceYearsLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
