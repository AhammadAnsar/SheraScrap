import React from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonials as defaultTestimonials } from '../data';
import { useCMS } from '../cms/CMSContext';
import { LanguagePack } from '../types';

interface TestimonialsProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function Testimonials({ lang, t }: TestimonialsProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const list = (cmsData.testimonials && cmsData.testimonials.length > 0)
    ? cmsData.testimonials
    : defaultTestimonials;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="reviews">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {isRtl ? "تجارب عملائنا الموثقة" : "Dammam Client Testimonials"}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {t.reviewsTitle}
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            {t.reviewsSubtitle}
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((test: any, idx: number) => {
            const name = isRtl 
              ? (test.nameAr || test.arabicName || test.name) 
              : (test.nameEn || test.name);
            const location = isRtl 
              ? (test.locationAr || test.arabicLocation || test.location) 
              : (test.locationEn || test.location);
            const text = isRtl 
              ? (test.textAr || test.arabicText || test.text) 
              : (test.textEn || test.text);
            const rating = test.rating || 5;
            const date = test.date || '2026';

            return (
              <div 
                key={test.id || idx} 
                className="bg-slate-50 border border-slate-200/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow"
                id={`testimonial-item-${idx}`}
              >
                <div className="absolute top-6 right-6 text-slate-200 pointer-events-none">
                  <Quote className="w-10 h-10 transform scale-x-[-1]" />
                </div>

                <div>
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-5 text-amber-500">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>

                  {/* Feedback text */}
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold italic mb-6">
                    "{text}"
                  </p>
                </div>

                {/* Profile info */}
                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{location}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-100">
                    {date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-source trust indicator */}
        <div className="mt-12 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⭐</div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h4 className="text-sm font-extrabold text-slate-800">
                {isRtl ? "مؤسسة سكراب مرخصة ومعتمدة بالمنطقة الشرقية" : "Fully Certified & Government Approved in Dammam"}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? "نقوم بإعادة التدوير بطرق آمنة ومطابقة لمعايير وزارة البيئة والبلدية." : "We strictly follow the local municipality guidelines for ecological scrap processing."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-black shrink-0">
            <span>🛡️ {isRtl ? "آمن ومضمون ١٠٠٪" : "100% Reliable & Licensed"}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
