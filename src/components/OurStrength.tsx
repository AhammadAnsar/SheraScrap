import React from 'react';
import { Truck, Scale, ShieldCheck, CheckCircle2, Phone, MessageSquare, Wrench, HardHat, Sparkles } from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { LanguagePack } from '../types';

interface OurStrengthProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function OurStrength({ lang, t }: OurStrengthProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';
  const equipments = cmsData.equipments && cmsData.equipments.length > 0
    ? cmsData.equipments.filter(e => e.active)
    : [];

  if (equipments.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden" id="our-strength">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{isRtl ? "قدراتنا ومعداتنا" : "Our Heavy Fleet"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4">
            {isRtl ? (
              <>أسطولنا ومعداتنا الثقيلة <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">لنقل وتثمين السكراب</span></>
            ) : (
              <>Our Heavy Equipment & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Fleet Strength</span></>
            )}
          </h2>

          <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            {isRtl 
              ? "نمتاك أحدث الأوناش الهيدروليكية، الموازين الإلكترونية المعتمدة، ومكابس التدوير بالشرقية لضمان أعلى سرعة وأفضل سعر كاش في موقعك."
              : "Equipped with hydraulic cranes, digital weighbridges, and heavy balers to provide fast on-site scrap removal across Eastern Province."}
          </p>
        </div>

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {equipments.map((item) => {
            const title = isRtl ? item.titleAr : item.titleEn;
            const subtitle = isRtl ? item.subtitleAr : item.subtitleEn;
            const capacity = isRtl ? item.capacityAr : item.capacityEn;
            const description = isRtl ? item.descriptionAr : item.descriptionEn;
            const specs = isRtl ? item.specificationsAr : item.specificationsEn;

            return (
              <div 
                key={item.id}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Capacity Badge */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'} 
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    
                    {/* Capacity Badge */}
                    {capacity && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full shadow-lg border border-emerald-400 flex items-center gap-1.5">
                        <HardHat className="w-3.5 h-3.5" />
                        <span>{capacity}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-1">
                      {title}
                    </h3>
                    
                    {subtitle && (
                      <p className="text-xs font-bold text-emerald-400/90 mb-3">
                        {subtitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4 line-clamp-3">
                      {description}
                    </p>

                    {/* Specifications List */}
                    {specs && specs.length > 0 && (
                      <div className="border-t border-slate-700/60 pt-3 mt-3 space-y-1.5">
                        {specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 mt-2">
                  <a
                    href={`https://wa.me/${cmsData.settings.whatsapp}?text=${encodeURIComponent(
                      isRtl 
                        ? `السلام عليكم، استفسر عن خدمة ونقل آليات: ${title}` 
                        : `Hello, inquiring about heavy equipment transport: ${title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 hover:text-white font-extrabold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isRtl ? "طلب نقل بهذه المعدات 🚛" : "Request Equipment Fleet 🚛"}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner Feature Bar */}
        <div className="mt-12 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm md:text-base font-extrabold text-white">
                {isRtl ? "جميع الآليات والموازين معتمدة رسمياً ومجهزة بفرق سريعة" : "All Equipment & Scales Are Certified Under Municipality Guidelines"}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {isRtl 
                  ? "نوفر عمالة مدربة وسائقين مرخصين لنقل كافة أوزان وأنواع السكراب مع الدفع الفوري كاش في موقعك." 
                  : "Certified drivers and specialized crews for immediate heavy scrap collection with on-the-spot cash payout."}
              </p>
            </div>
          </div>

          <a
            href={`tel:${cmsData.settings.phone}`}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs md:text-sm flex items-center gap-2 shrink-0 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Phone className="w-4 h-4" />
            <span>{isRtl ? "طلب كادر مع الميزان الآن" : "Call Dispatch Team"}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
