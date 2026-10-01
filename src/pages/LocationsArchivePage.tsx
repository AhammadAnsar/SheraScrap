import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { useCMS } from '../static/CMSContext';
import { defaultLocations } from '../data/defaults';
import { SITE_CONFIG } from '../config/site';

interface LocationsArchivePageProps {
  lang: 'ar' | 'en';
}

export default function LocationsArchivePage({ lang }: LocationsArchivePageProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const locations = (cmsData.locations ?? []).filter(l => l.isPublished);

  const title = isRtl
    ? 'مناطق التغطية والخدمة بالمنطقة الشرقية | شيرا سكراب'
    : 'Service Coverage Areas & Scrap Purchasing | Shera Scrap';
  const description = isRtl
    ? 'نشتري السكراب والمعادن ومعدات المطاعم والمكيفات والأثاث المستعمل بالدمام والخبر والجبيل وسيهات مع النقل المجاني والتثمين الفوري.'
    : 'We purchase metal scrap, restaurant equipment, AC units, and used items across Dammam, Khobar, and Jubail with free towing.';

  return (
    <>
      <SEO
        title={title}
        description={description}
        canonicalPath={`/${lang}/locations/`}
        lang={lang}
      />

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المنطقة الشرقية' : 'Eastern Province'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-100 mb-4">
            {isRtl ? 'مناطق تغطية شراء السكراب والمعدات' : 'Scrap & Equipment Purchasing Coverage Areas'}
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <article
              key={loc.id || loc.slug}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-800/60">
                    {isRtl ? loc.cityAr : loc.cityEn}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isRtl ? 'معاينة مجانية' : 'Free Inspection'}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2 leading-snug">
                  <Link reloadDocument to={`/${lang}/locations/${loc.slug}/`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {isRtl ? loc.titleAr : loc.titleEn}
                  </Link>
                </h2>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {isRtl ? loc.metaDescriptionAr : loc.metaDescriptionEn}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <a
                  href={`tel:${loc.phone || SITE_CONFIG.business.phone}`}
                  className="text-slate-300 font-bold hover:text-white flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{loc.phone || SITE_CONFIG.business.phoneDisplay}</span>
                </a>

                <Link reloadDocument to={`/${lang}/locations/${loc.slug}/`}
                  className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
