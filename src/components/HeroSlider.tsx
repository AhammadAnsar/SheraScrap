import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Hammer, 
  Clock, 
  Sparkles, 
  MapPin, 
  Zap, 
  DollarSign, 
  CheckCircle2, 
  Wrench, 
  Cpu, 
  Car, 
  Factory, 
  Home, 
  Flame,
  Award,
  Leaf
} from 'lucide-react';
import { LanguagePack } from '../types';
import { useCMS } from '../static/CMSContext';

interface HeroSliderProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function HeroSlider({ lang, t }: HeroSliderProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const activeSlides = cmsData.slides.filter(s => s.active);
  const totalSlides = activeSlides.length > 0 ? activeSlides.length : 4;
  const slideDuration = 6000;

  const scrollToEstimator = () => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;

    if (isLeftSwipe) {
      if (isRtl) handlePrev();
      else handleNext();
    } else if (isRightSwipe) {
      if (isRtl) handleNext();
      else handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const whatsappNum = cmsData.settings.whatsapp || '966573690164';

  const getWhatsAppLink = (textAr: string, textEn: string) => {
    const text = isRtl ? textAr : textEn;
    return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section 
      className="relative overflow-hidden bg-slate-950 text-white py-5 sm:py-8 md:py-12 border-b border-slate-800 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      id="hero-slider-section"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Top Header Badge & Clean Mobile Grid Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 border-b border-slate-800/80">
          
          {/* Official Authority Badge */}
          <div className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3.5 py-1.5 text-emerald-400 text-xs font-bold text-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isRtl 
                ? "المؤسسة الرسمية المعتمدة لشراء السكراب بالشرقية" 
                : "Official Certified Scrap Buyers in Eastern Province"}
            </span>
          </div>

          {/* Slider Tabs */}
          <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl md:rounded-full border border-slate-800">
            {[
              { id: 0, ar: "أنواع السكراب", en: "Scrap Types" },
              { id: 1, ar: "مميزاتنا الرسمية", en: "Specialties" },
              { id: 2, ar: "لماذا تختارنا؟", en: "Why Choose Us" },
              { id: 3, ar: "مناطق التغطية", en: "Coverage Areas" },
            ].map((slide) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(slide.id)}
                className={`w-full md:w-auto px-2.5 sm:px-3 py-1.5 rounded-xl md:rounded-full text-xs font-bold transition-all duration-300 text-center cursor-pointer ${
                  currentSlide === slide.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isRtl ? slide.ar : slide.en}
              </button>
            ))}
          </div>
        </div>

        {/* DYNAMIC RELATIVE SLIDE CONTAINER */}
        <div className="relative w-full min-h-[480px] sm:min-h-[500px] lg:min-h-[400px]">
          
          {/* ==================== SLIDE 1: TYPES OF SCRAP WE BUY ==================== */}
          <div className={`${currentSlide === 0 ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-300`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              
              {/* Text Info Column */}
              <div className="lg:col-span-5 flex flex-col items-start text-start">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-lg text-xs font-extrabold mb-2.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isRtl ? "أعلى أسعار شراء كاش فوري" : "Highest On-Site Cash Purchase"}</span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug mb-2.5">
                  {isRtl ? (
                    <>
                      أنواع <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">السكراب التي نشتريها</span> بالدمام
                    </>
                  ) : (
                    <>
                      Types of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Scrap Metal We Buy</span>
                    </>
                  )}
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                  {isRtl 
                    ? "نشتري جميع أنواع سكراب المعادن والمكيفات المستعملة والسيارات والمعدات بأوزان دقيقة ونقل مجاني فوري."
                    : "We buy all scrap metals, obsolete air conditioners, scrap vehicles, and industrial machinery with certified scales and free transport."}
                </p>

                {/* WhatsApp & Estimator CTA */}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <a
                    href={getWhatsAppLink(
                      "السلام عليكم، أريد بيع سكراب بالدمام وأطلب استفسار عن الأسعار الحالية",
                      "Hello, I want to sell scrap metal in Dammam. Please provide current purchasing rates."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95"
                  >
                    <Phone className="w-4 h-4 fill-slate-950 shrink-0" />
                    <span>{isRtl ? "تواصل واتساب مباشر للبيع" : "Sell Scrap via WhatsApp"}</span>
                  </a>

                  <button
                    onClick={scrollToEstimator}
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-emerald-400 border-2 border-slate-700 hover:border-emerald-500/50 font-black px-6 py-4 md:py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer hover:-translate-y-1 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isRtl ? 'طلب تسعير عبر واتساب' : 'Request a Quote'}</span>
                  </button>
                </div>
              </div>

              {/* Real Photo Grid Cards */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { 
                      arTitle: "حديد وسكراب معادن", enTitle: "Iron & Steel Scrap", 
                      arSub: "صلب وهياكل ثقيلة", enSub: "Heavy steel & iron", 
                      icon: Factory, 
                      image: "/resources/93acc40003a8d209.webp"
                    },
                    { 
                      arTitle: "إلكترونيات وأجهزة", enTitle: "Electronic Scrap", 
                      arSub: "أجهزة ولوحات إلكترونية", enSub: "Circuit boards & tech", 
                      icon: Cpu, 
                      image: "/resources/0a9b2792830a20ef.webp"
                    },
                    { 
                      arTitle: "سيارات ومحركات", enTitle: "Vehicle & Auto Scrap", 
                      arSub: "سيارات تالفة ومحركات", enSub: "Scrap cars & engines", 
                      icon: Car, 
                      image: "/resources/c4285322ff509751.webp"
                    },
                    { 
                      arTitle: "سكراب مصانع", enTitle: "Industrial Scrap", 
                      arSub: "معدات ومخلفات مصانع", enSub: "Factory steel & machines", 
                      icon: Wrench, 
                      image: "/resources/cabe12c97b0a935b.webp"
                    },
                    { 
                      arTitle: "مكيفات وأجهزة", enTitle: "ACs & Home Scrap", 
                      arSub: "مكيفات شباك وثلاجات", enSub: "Window/Split ACs & fridges", 
                      icon: Home, 
                      image: "/resources/7217a5333a99151a.webp"
                    },
                    { 
                      arTitle: "نحاس وكيابل", enTitle: "Copper & Cables", 
                      arSub: "نحاس أحمر وكيابل", enSub: "Pure copper & power wire", 
                      icon: Zap, 
                      image: "/resources/fallback.svg"
                    },
                  ].map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div 
                        key={idx}
                        className="group relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 shadow-md flex flex-col justify-end p-3 bg-slate-900"
                      >
                        {/* Background Real Image - Eager load for Slide 0 to maximize LCP */}
                        <img 
                          src={item.image} 
                          alt={isRtl ? item.arTitle : item.enTitle}
                          width="300"
                          height="200"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-50"
                          loading="eager"
                          // @ts-ignore
                          fetchPriority="high"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                        {/* Dark Gradient Overlay for High Text Contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

                        {/* Top Icon Badge */}
                        <div className="relative z-10 self-start w-7 h-7 bg-slate-900/90 border border-slate-700/80 rounded-lg flex items-center justify-center mb-auto text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>

                        {/* Text Content */}
                        <div className="relative z-10">
                          <h3 className="font-extrabold text-white text-xs sm:text-sm leading-tight group-hover:text-emerald-400 transition-colors">
                            {isRtl ? item.arTitle : item.enTitle}
                          </h3>
                          <p className="text-[10px] text-slate-300 font-medium mt-0.5 leading-tight opacity-90">
                            {isRtl ? item.arSub : item.enSub}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ==================== SLIDE 2: SPECIALTIES WITH REAL IMAGES ==================== */}
          <div className={`${currentSlide === 1 ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-300`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              
              {/* Text Header */}
              <div className="lg:col-span-5 flex flex-col items-start text-start">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg text-xs font-extrabold mb-2.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? "خدمات متميزة وشاملة" : "Premium Comprehensive Services"}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight">
                  {isRtl ? (
                    <>
                      مميزات واختصاصات <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">مؤسسة شيرا للسكراب</span>
                    </>
                  ) : (
                    <>
                      Specialties of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Shera Scrap Haraj</span>
                    </>
                  )}
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                  {isRtl 
                    ? "نخدمك بأعلى معايير المصداقية والسرعة مع تفكيك ونقل مجاني وشاحنات مجهزة."
                    : "Premium scrap trading service with free dismantling, digital scales, and instant on-site cash payment."}
                </p>

                <a
                  href={getWhatsAppLink(
                    "السلام عليكم، أريد الاستفادة من خدمة تفكيك ونقل السكراب مجاناً",
                    "Hello, I need free dismantling and scrap pickup service."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95"
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>{isRtl ? "طلب شاحنة تفكيك ونقل" : "Request Free Pickup Fleet"}</span>
                </a>
              </div>

              {/* 6 Real Photo Specialties Cards */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    {
                      icon: Scale,
                      arTitle: "ميزان إلكتروني دقيق",
                      enTitle: "Accurate Digital Scale",
                      arDesc: "موازين رقمية معتمدة 100%",
                      enDesc: "100% Certified digital scale",
                      image: "/resources/6599d475c3226f18.webp"
                    },
                    {
                      icon: Hammer,
                      arTitle: "تفكيك وفك مجاني",
                      enTitle: "Free Dismantling",
                      arDesc: "عمالة لتفكيك الأجهزة والمباني",
                      enDesc: "Professional crew site dismantling",
                      image: "/resources/17a77c482018ce2d.webp"
                    },
                    {
                      icon: Truck,
                      arTitle: "أسطول نقل هيدروليكي",
                      enTitle: "Transport Truck Fleet",
                      arDesc: "شاحنات جاهزة للتحميل الفوري",
                      enDesc: "Equipped trucks for heavy volume",
                      image: "/resources/b28604539c90c087.webp"
                    },
                    {
                      icon: Clock,
                      arTitle: "خدمة 24/7 متواصلة",
                      enTitle: "24/7 Continuous Service",
                      arDesc: "استجابة على مدار الساعة",
                      enDesc: "Round-the-clock emergency clearance",
                      image: "/resources/cfb23d9571d4c190.webp"
                    },
                    {
                      icon: Wrench,
                      arTitle: "معدات تفكيك حديثة",
                      enTitle: "Advanced Cutters",
                      arDesc: "أدوات هيدروليكية لرفع وقص المعادن",
                      enDesc: "Hydraulic tools & heavy cranes",
                      image: "/resources/fallback.svg"
                    },
                    {
                      icon: DollarSign,
                      arTitle: "تسليم كاش فوري",
                      enTitle: "Instant Cash Payment",
                      arDesc: "الدفع كاش بموقعك فور الوزن",
                      enDesc: "Instant SAR cash payout on site",
                      image: "/resources/7e040956a9c5ac83.webp"
                    },
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div key={idx} className="group relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 shadow-md flex flex-col justify-end p-3">
                        <img 
                          src={item.image} 
                          alt={isRtl ? item.arTitle : item.enTitle}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-45"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

                        <div className="relative z-10 self-start w-7 h-7 bg-slate-900/90 border border-slate-700/80 rounded-lg flex items-center justify-center mb-auto text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>

                        <div className="relative z-10">
                          <h3 className="font-extrabold text-white text-xs sm:text-sm leading-tight group-hover:text-emerald-400 transition-colors">
                            {isRtl ? item.arTitle : item.enTitle}
                          </h3>
                          <p className="text-[10px] text-slate-300 font-medium mt-0.5 leading-tight opacity-90">
                            {isRtl ? item.arDesc : item.enDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ==================== SLIDE 3: WHY CHOOSE US WITH REAL IMAGES ==================== */}
          <div className={`${currentSlide === 2 ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-300`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              
              <div className="lg:col-span-5 flex flex-col items-start text-start">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg text-xs font-extrabold mb-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isRtl ? "اختيار أكثر من 5000 عميل بالشرقية" : "Trusted by 5,000+ Customers"}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight">
                  {isRtl ? (
                    <>
                      لماذا يفضلنا أكثر من <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">5000 عميل بالشرقية؟</span>
                    </>
                  ) : (
                    <>
                      Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Shera Scrap Haraj?</span>
                    </>
                  )}
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                  {isRtl 
                    ? "نقدم أفضل الأسعار وتسهيلات كاملة لبيع السكراب مع الدفع النقدي المباشر."
                    : "Trusted by over 5,000 customers for top market cash rates, same-day service, and complete reliability."}
                </p>

                <a
                  href={getWhatsAppLink(
                    "السلام عليكم، أريد تقييم لسكراب وأرغب بالبيع بأعلى سعر اليوم",
                    "Hello, I want to evaluate my scrap for top market price today."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95"
                >
                  <Phone className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span>{isRtl ? "احصل على أعلى سعر الآن" : "Get Top Market Rate"}</span>
                </a>
              </div>

              {/* 6 Real Photo Advantage Cards */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    {
                      arTitle: "أعلى أسعار السوق",
                      enTitle: "Best Market Rates",
                      arDesc: "تحديث يومي بأسعار الدمام",
                      enDesc: "Updated daily according to market",
                      icon: DollarSign,
                      image: "/resources/1c5c7b2fa61210bb.webp"
                    },
                    {
                      arTitle: "خدمة في نفس اليوم",
                      enTitle: "Same Day Service",
                      arDesc: "وصول الشاحنة خلال ساعتين",
                      enDesc: "Truck arrives within 2 hours",
                      icon: Zap,
                      image: "/resources/4cee9a24a70ed88e.webp"
                    },
                    {
                      arTitle: "دفع كاش فوري",
                      enTitle: "Instant On-Site Cash",
                      arDesc: "تسليم المبلغ قبل التحميل",
                      enDesc: "Full cash payment prior to load",
                      icon: ShieldCheck,
                      image: "/resources/7e040956a9c5ac83.webp"
                    },
                    {
                      arTitle: "دقة كاملة بالميزان",
                      enTitle: "Accurate Scale",
                      arDesc: "موازين إلكترونية معتمدة",
                      enDesc: "Digital mobile scale accuracy",
                      icon: Scale,
                      image: "/resources/6599d475c3226f18.webp"
                    },
                    {
                      arTitle: "تدوير صديق للبيئة",
                      enTitle: "Eco Recycling",
                      arDesc: "معالجة بيئية آمنة ومعتمدة",
                      enDesc: "Safe recycling standard",
                      icon: Leaf,
                      image: "/resources/b9c0f4a685e6f6a2.webp"
                    },
                    {
                      arTitle: "دعم الشاحنات والرافعات",
                      enTitle: "Heavy Machinery",
                      arDesc: "رافعات هيدروليكية للمصانع",
                      enDesc: "Hydraulic cranes for yards",
                      icon: Truck,
                      image: "/resources/fallback.svg"
                    },
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div key={idx} className="group relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 shadow-md flex flex-col justify-end p-3">
                        <img 
                          src={item.image} 
                          alt={isRtl ? item.arTitle : item.enTitle}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-45"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

                        <div className="relative z-10 self-start w-7 h-7 bg-slate-900/90 border border-slate-700/80 rounded-lg flex items-center justify-center mb-auto text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>

                        <div className="relative z-10">
                          <h3 className="font-extrabold text-white text-xs sm:text-sm leading-tight group-hover:text-emerald-400 transition-colors">
                            {isRtl ? item.arTitle : item.enTitle}
                          </h3>
                          <p className="text-[10px] text-slate-300 font-medium mt-0.5 leading-tight opacity-90">
                            {isRtl ? item.arDesc : item.enDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ==================== SLIDE 4: COVERAGE CITIES WITH REAL IMAGES ==================== */}
          <div className={`${currentSlide === 3 ? 'block opacity-100' : 'hidden opacity-0'} transition-opacity duration-300`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              
              <div className="lg:col-span-5 flex flex-col items-start text-start">
                <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 px-3 py-1 rounded-lg text-xs font-extrabold mb-2.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{isRtl ? "تغطية كاملة للمنطقة الشرقية" : "Full Eastern Province Coverage"}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight">
                  {isRtl ? (
                    <>
                      مناطق تغطية <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300">خدماتنا بالشرقية</span>
                    </>
                  ) : (
                    <>
                      Our Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300">Coverage Area</span>
                    </>
                  )}
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                  {isRtl 
                    ? "أسطول شاحناتنا متواجد يومياً لنقل وتفكيك السكراب في جميع مدن ومحافظات الشرقية."
                    : "Our mobile truck fleet covers all major cities and industrial hubs across the Eastern Province."}
                </p>

                <a
                  href={getWhatsAppLink(
                    "السلام عليكم، أطلب شاحنة نقل سكراب لموقعي بالمنطقة الشرقية",
                    "Hello, I request a scrap pickup truck at my location in Eastern Province."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{isRtl ? "طلب شاحنة لمدينتك عبر الواتساب" : "Request Truck to Your City"}</span>
                </a>
              </div>

              {/* 6 Real Photo City Cards */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { 
                      nameAr: "الدمام", nameEn: "Dammam", 
                      tagAr: "نقل سريع 30 دقيقة", tagEn: "Express 30 Min",
                      image: "/resources/4d5e9883da7c3bb9.webp"
                    },
                    { 
                      nameAr: "الجبيل", nameEn: "Jubail", 
                      tagAr: "سكراب المصانع", tagEn: "Industrial Yard",
                      image: "/resources/ec7180f10f581c4a.webp"
                    },
                    { 
                      nameAr: "الخبر", nameEn: "Al Khobar", 
                      tagAr: "سكني وتجاري", tagEn: "Residential & Commercial",
                      image: "/resources/7fbea992fb166920.webp"
                    },
                    { 
                      nameAr: "النعيرية", nameEn: "Nairyah", 
                      tagAr: "معدات ثقيلة", tagEn: "Heavy Machinery Yard",
                      image: "/resources/45ae8be8dac14d2a.webp"
                    },
                    { 
                      nameAr: "الأحساء", nameEn: "Al Ahsa", 
                      tagAr: "تغطية شاملة", tagEn: "Full District Coverage",
                      image: "/resources/47d19d0b77126e73.webp"
                    },
                    { 
                      nameAr: "سلوى", nameEn: "Salwa", 
                      tagAr: "نقل حدودي", tagEn: "Border Logistics",
                      image: "/resources/4cee9a24a70ed88e.webp"
                    },
                  ].map((city, idx) => (
                    <div key={idx} className="group relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 shadow-md flex flex-col justify-end p-3">
                      <img 
                        src={city.image} 
                        alt={isRtl ? city.nameAr : city.nameEn}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-45"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

                      <div className="relative z-10 self-start mb-auto">
                        <span className="text-[9px] bg-slate-900/90 text-emerald-400 border border-slate-700/80 px-2 py-0.5 rounded font-bold backdrop-blur-sm">
                          {isRtl ? city.tagAr : city.tagEn}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                          {isRtl ? city.nameAr : city.nameEn}
                        </h3>
                        <p className="text-[10px] text-slate-300 font-medium opacity-90 mt-0.5">
                          {isRtl ? "المملكة العربية السعودية" : "Saudi Arabia"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM CONTROLS & INDICATORS */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
          
          {/* Pagination Indicators */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? 'w-7 bg-emerald-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] text-slate-400 font-bold ml-1">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>

          {/* Controls: Prev & Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={isRtl ? handleNext : handlePrev}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer active:scale-95 min-w-[38px] min-h-[38px] flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={isRtl ? handlePrev : handleNext}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer active:scale-95 min-w-[38px] min-h-[38px] flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
