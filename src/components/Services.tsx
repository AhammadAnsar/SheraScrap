import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { LanguagePack } from '../types';
import { useCMS } from '../cms/CMSContext';
import OptimizedImage from './common/OptimizedImage';

interface ServicesProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

// Map strings to safe stable Lucide icons
const getIcon = (name: string) => {
  switch (name) {
    case 'Cable':
    case 'Layers':
      return <Icons.Layers className="w-6 h-6 text-emerald-600" />;
    case 'Grid':
      return <Icons.Grid3X3 className="w-6 h-6 text-emerald-600" />;
    case 'Hammer':
      return <Icons.Hammer className="w-6 h-6 text-emerald-600" />;
    case 'Cpu':
      return <Icons.Cpu className="w-6 h-6 text-emerald-600" />;
    case 'Refrigerator':
    case 'Database':
      return <Icons.Database className="w-6 h-6 text-emerald-600" />;
    case 'Wind':
      return <Icons.Wind className="w-6 h-6 text-emerald-600" />;
    default:
      return <Icons.Sparkles className="w-6 h-6 text-emerald-600" />;
  }
};

export default function Services({ lang, t }: ServicesProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';
  const whatsappNum = cmsData.settings.whatsapp || '966573690164';

  const categories = cmsData.categories;

  return (
    <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100" id="services">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {isRtl ? "تخصصاتنا والأسعار" : "Specialties & Current Rates"}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {t.servicesTitle}
          </h2>
          <p className="text-slate-600 mt-4 leading-relaxed text-sm md:text-base">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const isFirstOrLast = index === 0 || index === categories.length - 1;
            const categoryTitle = isRtl ? cat.nameAr : cat.nameEn;
            const categorySubtitle = isRtl ? cat.descriptionAr : cat.descriptionEn;
            const rateEstimate = isRtl ? cat.rateEstimateAr : cat.rateEstimateEn;

            // Prefilled WhatsApp text for direct transaction
            const whatsAppText = encodeURIComponent(
              isRtl 
                ? `السلام عليكم، لدي سكراب للبيع في الدمام من فئة: ${categoryTitle}. أود الاستفسار عن تفاصيل النقل والوزن.` 
                : `Hello, I want to sell scrap in Dammam of category: ${categoryTitle}. Please coordinate the free pickup.`
            );

            return (
              <div 
                key={cat.id} 
                className={`flex flex-col justify-between bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 relative group ${
                  isFirstOrLast 
                    ? 'border-emerald-500/30 ring-2 ring-emerald-500/10' 
                    : 'border-slate-200/80 hover:border-emerald-300'
                }`}
                id={`service-${cat.id}`}
              >
                <div>
                  {/* Large Prominent Feature Image Header */}
                  <Link reloadDocument to={`/${lang}/services/${cat.slug || cat.id}/`} className="h-52 sm:h-56 w-full overflow-hidden relative bg-slate-900 border-b border-slate-100 block group-hover:opacity-95">
                    <OptimizedImage 
                      src={cat.featuredImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'} 
                      alt={categoryTitle} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
                    />
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Top Value / Most Requested Badge */}
                    {isFirstOrLast && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-slate-950 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <span>🔥</span>
                        <span>{isRtl ? "الأعلى طلباً كاش" : "Top Cash Value"}</span>
                      </div>
                    )}

                    {/* Floating Rate Tag */}
                    <div className="absolute bottom-3 right-3 left-3 flex justify-between items-end">
                      <span className="bg-slate-950/85 backdrop-blur-md text-emerald-400 font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border border-emerald-500/30 shadow-lg flex items-center gap-1.5">
                        <span className="text-emerald-400">💰</span>
                        <span>{rateEstimate}</span>
                      </span>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 space-y-2.5">
                    <Link reloadDocument to={`/${lang}/services/${cat.slug || cat.id}/`}>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {categoryTitle}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[40px]">
                      {categorySubtitle}
                    </p>
                  </div>
                </div>

                {/* Sell Now Action Footer */}
                <div className="p-6 pt-0 mt-4">
                  <a
                    href={`https://wa.me/${whatsappNum}?text=${whatsAppText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full block text-center font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md ${
                      isFirstOrLast 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20' 
                        : 'bg-slate-900 text-white hover:bg-emerald-700 hover:text-white'
                    }`}
                    id={`btn-sell-${cat.id}`}
                  >
                    {isRtl ? `طلب تسعير وبيع (${categoryTitle})` : `Get Quote for (${categoryTitle})`}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
