import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  variant?: 'light' | 'dark';
}

export default function LanguageSelector({ lang, setLang, variant = 'light' }: LanguageSelectorProps) {
  const isDark = variant === 'dark';

  return (
    <button
      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      className={isDark
        ? "flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-all font-bold text-xs select-none cursor-pointer shrink-0"
        : "flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-700 transition-all font-medium text-xs md:text-sm shadow-sm select-none cursor-pointer"
      }
      aria-label="Switch Language / تغيير اللغة"
      id="lang-selector-btn"
      title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
    >
      <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span className="hidden sm:inline">{lang === 'ar' ? 'English' : 'العربية'}</span>
      <span className="inline sm:hidden">{lang === 'ar' ? 'EN' : 'ع'}</span>
    </button>
  );
}
