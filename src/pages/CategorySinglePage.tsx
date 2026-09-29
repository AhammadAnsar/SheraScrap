import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { useCMS } from '../cms/CMSContext';
import OptimizedImage from '../components/common/OptimizedImage';
import NotFoundPage from './NotFoundPage';

interface CategorySinglePageProps {
  lang: 'ar' | 'en';
}

export default function CategorySinglePage({ lang }: CategorySinglePageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const service = cmsData.services.find(s => s.slug === slug && s.active !== false);
  const category = cmsData.categories.find(c => c.slug === slug) || (service ? {
    slug: service.slug, nameAr: service.titleAr, nameEn: service.titleEn,
    descriptionAr: (service as any).descriptionAr || service.subtitleAr, descriptionEn: (service as any).descriptionEn || service.subtitleEn,
    rateEstimateAr: service.rateEstimateAr || 'اتصل بنا للتسعير', rateEstimateEn: service.rateEstimateEn || 'Contact us for a quote', featuredImage: service.image,
  } : undefined);

  if (!category) {
    return <NotFoundPage lang={lang} />;
  }

  const title = isRtl ? category.nameAr : category.nameEn;
  const description = isRtl ? category.descriptionAr : category.descriptionEn;
  const rateEstimate = isRtl ? category.rateEstimateAr : category.rateEstimateEn;

  const whatsAppText = encodeURIComponent(
    isRtl 
      ? `السلام عليكم، لدي سكراب للبيع في الدمام من فئة: ${title}. أود الاستفسار عن التفاصيل والتسعير.` 
      : `Hello, I want to sell scrap in Dammam of category: ${title}. Please coordinate the free pickup.`
  );

  return (
    <>
      <SEO 
        title={`${title} | ${isRtl ? "شراء سكراب" : "Scrap Buyer"}`} 
        description={description} 
        image={category.featuredImage}
        canonicalPath={`/${lang}/services/${category.slug}/`}
        lang={lang}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link reloadDocument to={`/${lang}/services/`} className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:text-emerald-700">
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {isRtl ? "العودة للخدمات" : "Back to Services"}
        </Link>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100">
          <div className="h-64 sm:h-96 w-full relative">
            <OptimizedImage 
              src={category.featuredImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80'} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl md:text-5xl font-black text-white">{title}</h1>
            </div>
          </div>
          
          <div className="p-6 md:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {isRtl ? "السعر التقديري بالدمام" : "Estimated Rate in Dammam"}
                </span>
                <span className="text-2xl md:text-3xl font-black text-emerald-600">
                  {rateEstimate}
                </span>
              </div>
              
              <a 
                href={`https://wa.me/${cmsData.settings.whatsapp}?text=${whatsAppText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>{isRtl ? "بيع هذه المادة الآن" : "Sell This Scrap Material"}</span>
              </a>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {isRtl ? `عن خدمة شراء ${title}` : `About ${title} Purchasing`}
              </h2>
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
