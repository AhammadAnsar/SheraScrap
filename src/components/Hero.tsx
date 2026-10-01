import React from 'react';
import { Phone, CheckCircle2, Shield, Truck, Scale, Hammer, RefreshCw } from 'lucide-react';
import { LanguagePack } from '../types';
import { useCMS } from '../static/CMSContext';

interface HeroProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function Hero({ lang, t }: HeroProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';
  const whatsappNum = cmsData.settings.whatsapp || '966573690164';

  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-20 border-b border-slate-100" id="why-us">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-full px-4 py-1 text-emerald-800 text-xs font-black mb-3 shadow-sm">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isRtl ? "مؤسسة رسمية معتمدة بالشرقية" : "Certified Scrap Buyer KSA"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            {isRtl ? "لماذا يفضل العملاء بيع السكراب لمؤسسة شيرا بالدمام؟" : "Why Choose Shera Scrap Buyers in Dammam?"}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl mx-auto">
            {isRtl 
              ? "نوفر لك تجربة بيع سهلة ومريحة من مكانك مع ضمان السعر الأعلى بالريال السعودي والدفع النقدي الفوري قبل التحميل."
              : "Enjoy an effortless selling process from your location with top cash rates and 100% free transport."}
          </p>
        </div>

        {/* 4 Guarantees Grid (Psychological triggers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          
          <div className="bg-white border border-slate-100 hover:border-emerald-500/50 rounded-[2rem] p-6 sm:p-8 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] group flex flex-col items-start relative overflow-hidden">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 group-hover:-translate-y-1 transition-transform shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50">
              💵
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              {isRtl ? "دفع كاش فوري بالكامل" : "Instant Cash Payout"}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isRtl 
                ? "نسلّمك المبلغ كاملاً نقداً في موقعك فور الانتهاء من أوزان السكراب بدون أي تأخير." 
                : "Full cash payment handed directly to you on-site before any materials leave."}
            </p>
          </div>

          <div className="bg-white border border-slate-100 hover:border-emerald-500/50 rounded-[2rem] p-6 sm:p-8 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] group flex flex-col items-start relative overflow-hidden">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 group-hover:-translate-y-1 transition-transform shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50">
              🚛
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              {isRtl ? "شاحنات ونقل مجاني 100%" : "Free Pickup & Trucks"}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isRtl 
                ? "نصل بشاحناتنا ورافعاتنا الثقيلة إلى موقعك بالدمام، الخبر، والجبيل ونتحمل تكاليف النقل بالكامل." 
                : "Our heavy loader trucks reach your location across Dammam, Khobar & Jubail with zero fees."}
            </p>
          </div>

          <div className="bg-white border border-slate-100 hover:border-emerald-500/50 rounded-[2rem] p-6 sm:p-8 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] group flex flex-col items-start relative overflow-hidden">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 group-hover:-translate-y-1 transition-transform shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50">
              ⚖️
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              {isRtl ? "ميزان رقمي إلكتروني معتمد" : "Certified Digital Scales"}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isRtl 
                ? "نزن جميع المعادن والكابلات والمكيفات أمام عينيك بموازين إلكترونية دقيقة تضمن حقك بالكامل." 
                : "Transparent on-site digital weighing ensures every kilogram is accurately calculated."}
            </p>
          </div>

          <div className="bg-white border border-slate-100 hover:border-emerald-500/50 rounded-[2rem] p-6 sm:p-8 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] group flex flex-col items-start relative overflow-hidden">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 group-hover:-translate-y-1 transition-transform shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50">
              🛠️
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
              {isRtl ? "فك وتفكيك مجاني للمعدات" : "Free Unit Dismantling"}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {isRtl 
                ? "عمالتنا الفنية تفك المكيفات الثقيلة والمركزية وهياكل الحديد بدون أي جهد أو تكلفة عليك." 
                : "Trained industrial workers dismantle central ACs, generators, and heavy iron structures."}
            </p>
          </div>

        </div>

        {/* Quick Conversion Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-start relative z-10">
            <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              ⚡ {isRtl ? "معاينة فورية خلال 30 دقيقة" : "Fast Inspection in 30 Mins"}
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              {isRtl ? "هل لديك سكراب أو أجهزة مستعملة تود بيعها الآن؟" : "Have Scrap or Used Equipment to Sell Today?"}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              {isRtl 
                ? "أرسل لنا صور السكراب عبر الواتساب وسنقوم بإرسال التقييم المبدئي والسيارة لموقعك فوراً." 
                : "Send scrap photos via WhatsApp for an immediate price estimate and crew dispatch."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(isRtl ? 'السلام عليكم، لدي صور سكراب أريد تسعيرها ومعاينتها بالدمام' : 'Hello, I have scrap photos to evaluate in Dammam')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95 cursor-pointer"
            >
              <span>{isRtl ? "أرسل الصور للواتساب 🟢" : "Send Photos on WhatsApp 🟢"}</span>
            </a>

            <button
              onClick={scrollToEstimator}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <span>{isRtl ? 'اطلب تسعيرة عبر واتساب' : 'Request a WhatsApp Quote'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
