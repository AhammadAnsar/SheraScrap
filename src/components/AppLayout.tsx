import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquare, Phone, ArrowUp } from 'lucide-react';
import Header from './Header';
import { useCMS } from '../cms/CMSContext';
import { reservedPageSlugs } from '../routing/publicRoutes';
import { LanguagePack } from '../types';

interface AppLayoutProps {
  children: React.ReactNode;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  t: LanguagePack;
}

export default function AppLayout({ children, lang, setLang, t }: AppLayoutProps) {
  const { cmsData, isAdminOpen, currentUser } = useCMS();
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

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

  const isRtl = lang === 'ar';
  const theme = cmsData.theme;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between relative">

      <Header lang={lang} setLang={setLang} t={t} />

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 pt-16 pb-28 md:pb-12 px-4 border-t border-slate-800" id="footer">
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
            {!theme.enableWhiteLabel && (
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
            )}
          </div>
          
          <div className="flex gap-4 flex-wrap justify-center">
            <Link reloadDocument to={`/${lang}/`} className="hover:text-white transition-colors">{isRtl ? "الرئيسية" : "Home"}</Link>
            <Link reloadDocument to={`/${lang}/services/`} className="hover:text-white transition-colors">{isRtl ? "خدماتنا" : "Services"}</Link>
            <Link reloadDocument to={`/${lang}/locations/restaurant-equipment-dammam/`} className="hover:text-white transition-colors">{isRtl ? "معدات مطاعم الدمام" : "Restaurant Equipment"}</Link>
            <Link reloadDocument to={`/${lang}/locations/used-furniture-jubail/`} className="hover:text-white transition-colors">{isRtl ? "أثاث مستعمل الجبيل" : "Used Furniture Jubail"}</Link>
            <Link reloadDocument to={`/${lang}/blog/`} className="hover:text-white transition-colors">{isRtl ? "المقالات" : "Blog"}</Link>
          <Link reloadDocument to={`/${lang}/estimator/`} className="hover:text-white transition-colors">{isRtl ? 'طلب تسعير' : 'Get a Quote'}</Link>
            <Link reloadDocument to={`/${lang}/about/`} className="hover:text-white transition-colors">{isRtl ? "من نحن" : "About Us"}</Link>
            <Link reloadDocument to={`/${lang}/contact/`} className="hover:text-white transition-colors">{isRtl ? "اتصل بنا" : "Contact"}</Link>
            {cmsData.pages.filter(p => p.isPublished && !reservedPageSlugs.includes(p.slug)).map(p => (
              <Link reloadDocument key={p.id} to={`/${lang}/pages/${p.slug}/`} className="hover:text-white transition-colors">{isRtl ? p.titleAr : p.titleEn}</Link>
            ))}
          </div>
        </div>
      </footer>

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

      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.08)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        <a
          href={`tel:${cmsData.settings.phone}`}
          className="flex-1 bg-slate-900 active:bg-slate-800 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg transition-transform active:scale-95"
        >
          <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{isRtl ? "اتصال فوري" : "Call Now"}</span>
        </a>
        <a
          href={`https://wa.me/${cmsData.settings.whatsapp}?text=${encodeURIComponent(isRtl ? 'السلام عليكم، أريد بيع سكراب بالدمام واستفسر عن الأسعار.' : 'Hello, I want to sell scrap metal in Dammam.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-600 active:bg-emerald-700 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-600/20 transition-transform active:scale-95"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>{isRtl ? "تواصل واتساب" : "WhatsApp"}</span>
        </a>
      </div>

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
