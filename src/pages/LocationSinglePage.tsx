import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MessageSquare, MapPin, CheckCircle2, ArrowRight, ArrowLeft, Truck, ShieldCheck, Scale } from 'lucide-react';
import SEO from '../components/SEO';
import { useCMS } from '../cms/CMSContext';
import { defaultLocations } from '../data/defaults';
import { SITE_CONFIG } from '../config/site';

interface LocationSinglePageProps {
  lang: 'ar' | 'en';
}

export default function LocationSinglePage({ lang }: LocationSinglePageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const locations = (cmsData.locations && cmsData.locations.length > 0) ? cmsData.locations : defaultLocations;
  const locationItem = locations.find(l => l.slug === slug && l.isPublished);

  if (!locationItem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-4xl font-black text-slate-900 mb-4">404</h1>
        <p className="text-slate-600 mb-6 font-medium">
          {isRtl ? "الصفحة المطلوبة لم يتم العثور عليها" : "Location page not found"}
        </p>
        <Link 
          to={`/${lang}/`} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          {isRtl ? "العودة للرئيسية" : "Return to Home"}
        </Link>
      </div>
    );
  }

  const title = isRtl ? locationItem.titleAr : locationItem.titleEn;
  const city = isRtl ? locationItem.cityAr : locationItem.cityEn;
  const metaDesc = isRtl ? locationItem.metaDescriptionAr : locationItem.metaDescriptionEn;
  const content = isRtl ? locationItem.contentAr : locationItem.contentEn;
  const services = isRtl ? locationItem.servicesOfferedAr : locationItem.servicesOfferedEn;
  const phone = locationItem.phone || SITE_CONFIG.business.phone;
  const address = isRtl ? (locationItem.addressAr || SITE_CONFIG.business.addressAr) : (locationItem.addressEn || SITE_CONFIG.business.addressEn);

  const whatsAppText = encodeURIComponent(
    isRtl
      ? `السلام عليكم، أود بيع معدات/سكراب في ${city} (${title}). يرجى التنسيق للمعاينة والاستلام الكاش.`
      : `Hello, I want to sell scrap / equipment in ${city} (${title}). Please coordinate free inspection and cash payout.`
  );

  return (
    <>
      <SEO 
        title={title}
        description={metaDesc}
        canonicalPath={`/${lang}/locations/${locationItem.slug}/`}
        lang={lang}
      />

      <div className="bg-slate-50 py-8 md:py-14">
        <div className="max-w-5xl mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-bold mb-6">
            <Link to={`/${lang}/`} className="hover:text-emerald-600 transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span>/</span>
            <Link to={`/${lang}/services/`} className="hover:text-emerald-600 transition-colors">
              {isRtl ? "الخدمات والمناطق" : "Services & Locations"}
            </Link>
            <span>/</span>
            <span className="text-slate-900 truncate">{city}</span>
          </nav>

          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 md:p-12 text-white shadow-xl relative overflow-hidden mb-10">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-black mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isRtl ? `تغطية شاملة في ${city}` : `Full Coverage in ${city}`}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
                {title}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
                {metaDesc}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a 
                  href={`https://wa.me/${SITE_CONFIG.business.whatsapp}?text=${whatsAppText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>{isRtl ? "تواصل واتساب للمعالجة الفورية" : "Chat on WhatsApp for Instant Quote"}</span>
                </a>
                <a 
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3.5 rounded-2xl border border-slate-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Content & Service Pillars Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 pb-4 border-b border-slate-100">
                  {isRtl ? `تفاصيل الخدمة والمعاينة في ${city}` : `Service Details in ${city}`}
                </h2>
                <div className="text-slate-700 leading-relaxed space-y-4 whitespace-pre-line text-sm md:text-base font-normal">
                  {content}
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <Truck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">
                    {isRtl ? "نقل وفك مجاني" : "Free Truck Pickup"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRtl ? "لا نخصم أي مصاريف نقل" : "Zero transport deduction"}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <Scale className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">
                    {isRtl ? "موازين إلكترونية" : "Certified Digital Scales"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRtl ? "وزن دقيق وشفاف أمامك" : "Calibrated live on-site"}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">
                    {isRtl ? "دفع كاش فوري" : "Instant Cash Payout"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRtl ? "تسليم نقدي فوري باليد" : "Direct SAR cash handover"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Services Offered */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {isRtl ? "المواد والخدمات المشمولة" : "Included Services"}
                </h3>
                <ul className="space-y-3">
                  {services.map((srv, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{srv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location Card */}
              <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-md">
                <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>{isRtl ? "مركز الخدمة والتغطية" : "Service Area"}</span>
                </h3>
                <p className="text-slate-300 text-xs md:text-sm mb-4 leading-relaxed">
                  {address}
                </p>
                <div className="border-t border-emerald-800/60 pt-4">
                  <p className="text-xs text-emerald-300 font-bold mb-2">
                    {isRtl ? "ساعات العمل والتواجد:" : "Working Hours:"}
                  </p>
                  <p className="text-xs text-slate-200">
                    {isRtl ? SITE_CONFIG.business.openingHoursDisplayAr : SITE_CONFIG.business.openingHoursDisplayEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
