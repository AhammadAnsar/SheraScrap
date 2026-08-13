import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, MapPin, Scale, HelpCircle, ArrowUp } from 'lucide-react';

import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import Hero from './components/Hero';
import OurStrength from './components/OurStrength';
import TrustStats from './components/TrustStats';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';

import AdminBar from './components/admin/AdminBar';

import { CMSProvider, useCMS } from './cms/CMSContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogPostPage from './components/BlogPostPage';
import { arabicTranslations, englishTranslations } from './data';
import { LanguagePack } from './types';

// Lazy load non-critical and below-the-fold components to maximize Core Web Vitals & PageSpeed
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminLoginModal = React.lazy(() => import('./components/admin/AdminLoginModal'));
const BlogSection = React.lazy(() => import('./components/BlogSection'));
const VideoSection = React.lazy(() => import('./components/VideoSection'));
const ScrapEstimator = React.lazy(() => import('./components/ScrapEstimator'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const ContactForm = React.lazy(() => import('./components/ContactForm'));
const FAQ = React.lazy(() => import('./components/FAQ'));

function MainAppContent() {
  const { cmsData, isAdminOpen, setIsAdminOpen, currentUser } = useCMS();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Auto-detect location & browser language
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isMiddleEastZone = [
        'Asia/Riyadh',
        'Asia/Kuwait',
        'Asia/Qatar',
        'Asia/Bahrain',
        'Asia/Dubai',
        'Asia/Muscat',
        'Africa/Cairo'
      ].some(tz => timeZone && timeZone.includes(tz));

      const browserLang = navigator.language || (navigator as any).userLanguage;
      const isArabicDevice = browserLang && browserLang.startsWith('ar');

      if (isMiddleEastZone || isArabicDevice) {
        setLang('ar');
      } else {
        setLang('en');
      }
    } catch (e) {
      setLang('ar');
    }
  }, []);

  // Check URL query or hash for Admin access (?admin, #admin, /admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isHashAdmin = window.location.hash === '#admin' || window.location.hash === '#login';
    const isPathAdmin = window.location.pathname.endsWith('/admin') || window.location.pathname.endsWith('/login');
    if (params.has('admin') || params.has('login') || isHashAdmin || isPathAdmin) {
      setIsAdminOpen(true);
    }
  }, [setIsAdminOpen]);

  // Set page direction & titles dynamically from CMS settings
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = lang === 'ar' 
      ? cmsData.settings.seoTitleAr || cmsData.settings.siteTitleAr
      : cmsData.settings.seoTitleEn || cmsData.settings.siteTitleEn;
  }, [lang, cmsData.settings]);

  // Scroll tracking
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const t: LanguagePack = lang === 'ar' ? arabicTranslations : englishTranslations;
  const isRtl = lang === 'ar';
  const theme = cmsData.theme;

  // Render Full Admin Panel if Admin Mode is opened and User is Authenticated
  if (isAdminOpen && currentUser) {
    return (
      <div dir="ltr" className="h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
        <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Admin System...</div>}>
          <AdminLayout lang="en" setLang={setLang} />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between relative">
      
      {/* SoftDows CMS Admin Bar at Top */}
      <div dir="ltr"><AdminBar lang="en" setLang={setLang} /></div>

      {/* Admin Login Modal if requested without active session */}
      {isAdminOpen && !currentUser && (
        <React.Suspense fallback={null}>
          <div dir="ltr"><AdminLoginModal lang="en" /></div>
        </React.Suspense>
      )}

      {/* Public Header */}
      <Header lang={lang} setLang={setLang} t={t} />

      {/* Main Content Panels */}
      <main className="flex-grow">
        
        {/* Interactive Hero Slider with custom slides & WhatsApp triggers */}
        <HeroSlider lang={lang} t={t} />

        {/* Hero Trust Overview & Authority triggers */}
        <Hero lang={lang} t={t} />

        {/* Our Strength Equipment & Fleet Section */}
        <OurStrength lang={lang} t={t} />

        {/* Reciprocity info section highlighting free services */}
        <section className="bg-white py-12 border-b border-slate-100" id="why-us">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 flex flex-col items-start text-right md:text-start">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 w-full">
                🤝 {t.reciprocityTitle}
              </h3>
              <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed max-w-4xl">
                {t.reciprocityDesc}
              </p>
            </div>
            <div className="md:col-span-4 bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
              <span className="text-4xl mb-3">⚖️</span>
              <h4 className="font-extrabold text-emerald-800 text-sm md:text-base">{isRtl ? "ميزان إلكتروني دقيق ومعتمد" : "100% Calibrated Scales"}</h4>
              <p className="text-xs text-emerald-700/80 mt-1 max-w-xs font-semibold leading-relaxed">
                {isRtl 
                  ? "نزن جميع المعادن والمكيفات بموازين رقمية معتمدة أمام عينيك لتضمن أدق قيمة لقطعك السكراب." 
                  : "We weigh all scrap materials transparently on certified, precision digital meters at your location."}
              </p>
            </div>
          </div>
        </section>

        {/* Trust Metric bar */}
        <TrustStats lang={lang} t={t} />

        {/* Services section */}
        <Services lang={lang} t={t} />

        {/* Why Choose Shera Scrap Buyers section */}
        <WhyChooseUs lang={lang} t={t} />

        {/* Below-the-fold dynamic modules wrapped in Suspense */}
        <React.Suspense fallback={<div className="py-12 bg-slate-900/10 min-h-[150px]" />}>
          {/* Blog / Articles Section (Managed via CMS) */}
          <BlogSection lang={lang} />

          {/* Video Posts Section (Managed via CMS) */}
          <VideoSection lang={lang} />

          {/* AI Scrap Estimator */}
          <ScrapEstimator lang={lang} t={t} />

          {/* Testimonials section */}
          <Testimonials lang={lang} t={t} />

          {/* Contact details panel & Map embed */}
          <ContactForm lang={lang} t={t} />

          {/* Answer-First FAQs */}
          <FAQ lang={lang} t={t} />
        </React.Suspense>

      </main>

      {/* Corporate Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-12 pb-24 md:pb-12 px-4 border-t border-slate-800" id="footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-white">
              {cmsData.settings.siteLogo ? (
                <img 
                  src={cmsData.settings.siteLogo} 
                  alt={isRtl ? cmsData.settings.siteTitleAr : cmsData.settings.siteTitleEn} 
                  className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-lg shrink-0" 
                />
              ) : (
                <div className="bg-emerald-600 text-white p-2 rounded-lg font-bold">S</div>
              )}
              <span className="font-black text-base md:text-lg">{isRtl ? cmsData.settings.siteTitleAr : cmsData.settings.siteTitleEn}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isRtl ? cmsData.settings.seoDescriptionAr : cmsData.settings.seoDescriptionEn}
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs text-white font-extrabold uppercase tracking-wider">{isRtl ? "دليل سكراب حراج الدمام" : "Scrap Services Index"}</h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-semibold">
              <li>{isRtl ? "شراء مكيفات مستعملة الدمام" : "Used AC buyer Dammam"}</li>
              <li>{isRtl ? "شراء سكراب النحاس" : "Copper Scrap Dammam"}</li>
              <li>{isRtl ? "حديد سكراب للبيع" : "Steel & Iron recycling"}</li>
              <li>{isRtl ? "شراء ألمنيوم بالدمام" : "Aluminum scrap purchase"}</li>
              <li>{isRtl ? "كابلات وأسلاك نحاسية" : "Electric wire recycling"}</li>
              <li>{isRtl ? "سكراب الأجهزة المنزلية" : "Appliance scrap buyer"}</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs text-white font-extrabold uppercase tracking-wider">{isRtl ? "الالتزام البيئي والبلدي" : "Compliance & Standards"}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {isRtl 
                ? "جميع عملياتنا معتمدة ومطابقة لتعليمات أمانة المنطقة الشرقية وهيئة الأرصاد وحماية البيئة بالمملكة العربية السعودية لضمان تدوير نظيف وصديق للبيئة."
                : "All operations are certified under Eastern Province Municipality standards, promoting ecologically responsible scrap sorting and metal processing."}
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800/60 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-semibold gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-start">
            <p>{isRtl ? theme.footerTextAr : theme.footerTextEn}</p>
            <span className="hidden sm:inline text-slate-700">|</span>
            <p className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span>{isRtl ? "تصميم وتطوير بواسطة:" : "Design and Development by"}</span>
              <a 
                href="https://softdows.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-emerald-300 transition-colors"
              >
                SoftDows (softdows.com)
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#services" className="hover:text-white transition-colors">{isRtl ? "خدماتنا" : "Services"}</a>
            <a href="#blog-articles" className="hover:text-white transition-colors">{isRtl ? "المقالات" : "Blog"}</a>
            <a href="#estimator" className="hover:text-white transition-colors">{isRtl ? "مقيّم الذكاء الاصطناعي" : "AI Estimator"}</a>
            <a href="#faq" className="hover:text-white transition-colors">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</a>
          </div>
        </div>
      </footer>

      {/* Desktop Floating WhatsApp Button */}
      {theme.enableFloatingWhatsapp && (
        <a
          href={`https://wa.me/${cmsData.settings.whatsapp}?text=${encodeURIComponent(isRtl ? 'السلام عليكم، أريد بيع سكراب بالدمام واستفسر عن الأسعار.' : 'Hello, I want to sell scrap metal in Dammam.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden md:flex fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-30 items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-white`}
          aria-label="Direct Chat on WhatsApp"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>
          <MessageSquare className="w-5 h-5 fill-white" />
          <span className="text-xs md:text-sm whitespace-nowrap">{t.whatsAppBtn}</span>
        </a>
      )}

      {/* Mobile High-Conversion Sticky Bottom Navigation Bar (Phone + WhatsApp) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-4 shadow-2xl flex items-center justify-between gap-2">
        <a
          href={`tel:${cmsData.settings.phone}`}
          className="flex-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs border border-slate-700/80 shadow-md"
        >
          <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{isRtl ? "اتصل فوراً" : "Call Now"}</span>
        </a>

        <a
          href={`https://wa.me/${cmsData.settings.whatsapp}?text=${encodeURIComponent(isRtl ? 'السلام عليكم، أريد بيع سكراب بالدمام واستفسر عن الأسعار.' : 'Hello, I want to sell scrap metal in Dammam.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/30"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>{isRtl ? "واتساب مباشر" : "WhatsApp Direct"}</span>
        </a>
      </div>

      {/* Floating Scroll-to-top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-16 md:bottom-6 ${isRtl ? 'right-4 md:right-6' : 'left-4 md:left-6'} z-30 bg-slate-900/85 hover:bg-slate-900 text-white p-2.5 md:p-3 rounded-full shadow-lg transition-all border border-slate-700/50 hover:scale-105 active:scale-95 cursor-pointer`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainAppContent />} />
          <Route path="/article/:slug" element={
            <MainWrapper><BlogPostPageWrapper /></MainWrapper>
          } />
        </Routes>
      </Router>
    </CMSProvider>
  );
}

// Wrapper to provide language context to child pages
function MainWrapper({ children }: { children: React.ReactNode }) {
  const { cmsData, isAdminOpen, currentUser } = useCMS();
  if (isAdminOpen && currentUser) {
    return <div className="h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden"><React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Admin System...</div>}><AdminLayout lang="en" setLang={()=>{}} /></React.Suspense></div>;
  }
  return <>{children}</>;
}

function BlogPostPageWrapper() {
  const [lang, setLang] = React.useState<'ar' | 'en'>('ar');
  const t = lang === 'ar' ? arabicTranslations : englishTranslations;
  
  React.useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isMiddleEastZone = ['Asia/Riyadh', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Bahrain', 'Asia/Dubai', 'Asia/Muscat', 'Africa/Cairo'].some(tz => timeZone && timeZone.includes(tz));
      const browserLang = navigator.language || (navigator as any).userLanguage;
      const isArabicDevice = browserLang && browserLang.startsWith('ar');
      if (isMiddleEastZone || isArabicDevice) {
        setLang('ar');
      } else {
        setLang('en');
      }
    } catch (e) {
      setLang('ar');
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return <BlogPostPage lang={lang} setLang={setLang} t={t} />;
}
