import React from 'react';
import { ShieldCheck, Banknote, Truck, Scale, Clock, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../static/CMSContext';
import { LanguagePack } from '../types';

interface WhyChooseUsProps {
  lang: 'ar' | 'en';
  t?: LanguagePack;
}

export default function WhyChooseUs({ lang }: WhyChooseUsProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const features = cmsData.whyUsFeatures && cmsData.whyUsFeatures.length > 0
    ? cmsData.whyUsFeatures.filter(f => f.active)
    : [
        {
          id: "why-1",
          titleAr: "أعلى سعر كاش فوري بالدمام",
          titleEn: "Highest Instant Cash Rate in Dammam",
          descAr: "نضمن لك أعلى سعر كيلو للمكيفات والنحاس والحديد بالمنطقة الشرقية وفق بورصة المعادن اليومية مع تسليم المبلغ كاش فورياً.",
          descEn: "Get top daily market rates for copper, iron, ACs, and aluminum with instant cash on delivery.",
          iconName: "Banknote",
          order: 1,
          active: true
        },
        {
          id: "why-2",
          titleAr: "تحميل ونقل مجاني 100%",
          titleEn: "100% Free Dismantling & Transportation",
          descAr: "فريقنا المتخصص يتكفل بفك المكيفات وتحميل الخردة والحديد الثقيل بأحدث الشاحنات دون تحميلك أي تكاليف إضافية.",
          descEn: "Our expert team handles dismantling, heavy lifting, and transport with zero hidden fees.",
          iconName: "Truck",
          order: 2,
          active: true
        },
        {
          id: "why-3",
          titleAr: "موازين رقمية معتمدة أمامك",
          titleEn: "100% Calibrated Digital Scale",
          descAr: "نزن كافة الكميات بموازين إلكترونية دقيقة ومعتمدة بحضورك لضمان الشفافية والعدالة الكاملة في التثمين.",
          descEn: "Transparent weighing on certified electronic scales right at your site.",
          iconName: "Scale",
          order: 3,
          active: true
        },
        {
          id: "why-4",
          titleAr: "خدمة فورية خلال 30 دقيقة",
          titleEn: "30-Minute Rapid On-Site Response",
          descAr: "نغطي كافة أحياء الدمام والخبر والظهران والجبيل والقطيف على مدار 24 ساعة يومياً طوال أيام الأسبوع.",
          descEn: "Covering all districts of Dammam, Khobar, Jubail, and Dhahran 24/7.",
          iconName: "Clock",
          order: 4,
          active: true
        }
      ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Banknote': return <Banknote className="w-6 h-6 text-emerald-400" />;
      case 'Truck': return <Truck className="w-6 h-6 text-emerald-400" />;
      case 'Scale': return <Scale className="w-6 h-6 text-emerald-400" />;
      case 'Clock': return <Clock className="w-6 h-6 text-emerald-400" />;
      default: return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            {isRtl ? "لماذا تختار مؤسسة شيرا لشراء السكراب بالدمام؟" : "Why Choose Shera Scrap Buyers in Dammam?"}
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white mt-4 tracking-tight leading-tight">
            {isRtl ? "مزايانا التنافسية وضمانات السعر العادل" : "Our Competitive Advantages & Fair Price Guarantees"}
          </h2>
          <p className="text-slate-300 mt-3 text-sm md:text-base leading-relaxed font-medium">
            {isRtl 
              ? "نقدم تجربة بيع سكراب سلسة وآمنة ومربحة للشركات والأفراد بالمنطقة الشرقية" 
              : "Providing a seamless, secure, and profitable scrap selling experience across the Eastern Province"}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const title = isRtl ? item.titleAr : item.titleEn;
            const desc = isRtl ? item.descAr : item.descEn;

            return (
              <div
                key={item.id}
                className="bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="p-3 bg-slate-900/90 border border-slate-700/60 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    {getIcon(item.iconName)}
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? "خدمة مضمونة 100%" : "100% Guaranteed"}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
