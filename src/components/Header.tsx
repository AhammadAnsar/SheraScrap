import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, MessageSquare, MapPin, Clock, ShieldCheck, Megaphone, Lock, Search, X, ArrowRight } from 'lucide-react';
import { LanguagePack } from '../types';
import LanguageSelector from './LanguageSelector';
import { useCMS } from '../cms/CMSContext';

interface HeaderProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  t: LanguagePack;
}

export default function Header({ lang, setLang, t }: HeaderProps) {
  const { cmsData, setIsAdminOpen, logSearchQuery } = useCMS();
  const isRtl = lang === 'ar';
  const settings = cmsData.settings;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Log query in CMS analytics
    logSearchQuery(searchQuery, 'عام', 'header_search');

    // Scroll to services or estimator
    scrollToSection('services');
    setIsSearchOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm" id="main-header">
      
      {/* Top Announcement Bar if enabled in CMS */}
      {settings.showAnnouncementBar && (
        <div className="bg-emerald-600 text-slate-950 py-1.5 px-4 text-xs font-black text-center flex items-center justify-center gap-2">
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {isRtl ? settings.announcementBarAr : settings.announcementBarEn}
          </span>
        </div>
      )}

      {/* Upper bar with metadata */}
      <div className="w-full bg-slate-900 text-slate-300 py-1.5 px-3 sm:px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-nowrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center gap-1 text-[11px] sm:text-xs truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{isRtl ? settings.locationAr : settings.locationEn}</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-[11px] sm:text-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{isRtl ? settings.workingHoursAr : settings.workingHoursEn}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ms-auto">
            <LanguageSelector lang={lang} setLang={setLang} variant="dark" />
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-1 px-1.5 sm:px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold border border-slate-700 shrink-0"
              title={isRtl ? "دخول الأدمن" : "Admin Login"}
              aria-label="Admin Login"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">{isRtl ? "الأدمن" : "Admin"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center relative gap-2">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { if(location.pathname !== '/') { navigate('/'); } else { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group min-w-0"
          id="brand-logo"
        >
          {settings.siteLogo ? (
            <img 
              src={settings.siteLogo} 
              alt={isRtl ? settings.siteTitleAr : settings.siteTitleEn} 
              className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-xl font-black flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-all duration-300 shrink-0">
              <span className="text-xl md:text-2xl font-black tracking-wider drop-shadow">S</span>
            </div>
          )}
          
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-sm sm:text-lg md:text-xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-emerald-700 transition-colors truncate">
              {isRtl ? (settings.siteTitleAr || "Shera Scrap Haraj") : (settings.siteTitleEn || "Shera Scrap Haraj")}
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-black text-emerald-600 tracking-wide mt-0.5 truncate">
              {isRtl ? (settings.siteTaglineAr || "Best Metal Scrap Dealer") : (settings.siteTaglineEn || "Best Metal Scrap Dealer")}
            </p>
          </div>
        </div>

        {/* Desktop Menu links */}
        <nav className="hidden xl:flex items-center gap-7 text-sm font-bold text-slate-700">
          <button onClick={() => scrollToSection('services')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "خدماتنا" : "Services"}</button>
          <button onClick={() => scrollToSection('blog-articles')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "المقالات والأخبار" : "Blog & Guides"}</button>
          <button onClick={() => scrollToSection('estimator')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "مقيّم الذكاء الاصطناعي" : "AI Estimator"}</button>
          <button onClick={() => scrollToSection('why-choose-us')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "لماذا نحن" : "Why Choose Us"}</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "اتصل بنا" : "Contact"}</button>
        </nav>

        {/* Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={`tel:${settings.phone}`}
            className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl transition-all font-black text-xs md:text-sm shadow-md cursor-pointer border border-slate-800 shrink-0"
            id="header-phone-btn"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{settings.phone}</span>
            <span className="inline sm:hidden">{isRtl ? "اتصل" : "Call"}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
