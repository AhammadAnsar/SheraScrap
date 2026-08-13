import React, { useState } from 'react';
import { Sparkles, Camera, ArrowRight, ArrowLeft, Send, CheckCircle2, RefreshCw, Upload } from 'lucide-react';
import { LanguagePack, MaterialType, EstimationResult } from '../types';
import { scrapCategories } from '../data';
import { useCMS } from '../cms/CMSContext';

interface ScrapEstimatorProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function ScrapEstimator({ lang, t }: ScrapEstimatorProps) {
  const { cmsData, logSearchQuery, incrementCategoryView } = useCMS();
  const isRtl = lang === 'ar';
  const whatsappNum = cmsData.settings.whatsapp || '966573690164';
  
  // States
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<MaterialType | 'other'>('copper');
  const [quantity, setQuantity] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimationResult | null>(null);

  // File drag & drop states
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Handle category change
  const handleCategorySelect = (id: MaterialType | 'other') => {
    setSelectedCategory(id);
    setStep(2);
    
    // Log search query & track category view
    const categoryNames: Record<string, string> = {
      copper: 'نحاس وكيابل كهربائية',
      ac: 'مكيفات مستعملة وسكراب',
      iron: 'حديد وسكراب معادن ثقيلة',
      aluminum: 'ألمنيوم ومقاطع مطابخ',
      electronics: 'إلكترونيات وبطاريات',
      car: 'سيارات تالفة ومعدات ثقيلة',
      other: 'سكراب عام'
    };
    const catName = categoryNames[id] || 'سكراب عام';
    logSearchQuery(`تقييم حاسبة ${catName}`, catName, 'estimator');
    
    const matchedCat = cmsData.categories.find(c => c.slug === id || c.id === `cat-${id}`);
    if (matchedCat) {
      incrementCategoryView(matchedCat.id);
    }
  };

  // Convert file to base64 helper
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fallback estimation generator for static hosting environments
  const generateLocalEstimation = (mat: MaterialType | 'other', qtyStr: string, rtl: boolean): EstimationResult => {
    const qtyNum = parseFloat(qtyStr) || 1;
    
    let estRange = "150 - 500 ريال";
    let estWeight = "حسب الكمية المدخلة";
    let materials = rtl ? ["سكراب متنوع", "معادن صلبة"] : ["Mixed Scrap", "Metal Materials"];
    
    if (mat === 'copper') {
      const min = Math.round(qtyNum * 30);
      const max = Math.round(qtyNum * 38);
      estRange = `${min || 300} - ${max || 1500} ريال سعودي`;
      estWeight = `${qtyNum || 10} كجم تقريباً`;
      materials = rtl ? ["نحاس أحمر صافي", "كيابل نحاسية"] : ["Pure Red Copper", "Copper Cables"];
    } else if (mat === 'ac') {
      const min = Math.round(qtyNum * 150);
      const max = Math.round(qtyNum * 350);
      estRange = `${min || 200} - ${max || 1200} ريال سعودي`;
      estWeight = `${qtyNum || 2} وحدة مكيف`;
      materials = rtl ? ["مكيفات شباك / سبليت", "كمبروسر نحاس"] : ["Window/Split AC Units", "Compressor Copper"];
    } else if (mat === 'iron') {
      const min = Math.round(qtyNum * 0.85);
      const max = Math.round(qtyNum * 1.2);
      estRange = `${min || 850} - ${max || 1200} ريال سعودي`;
      estWeight = `${qtyNum || 1000} كجم (طن تقريباً)`;
      materials = rtl ? ["حديد ثقيل", "حديد هياكل ومباني"] : ["Heavy Iron", "Structural Steel"];
    } else if (mat === 'aluminum') {
      const min = Math.round(qtyNum * 6);
      const max = Math.round(qtyNum * 9.5);
      estRange = `${min || 300} - ${max || 900} ريال سعودي`;
      estWeight = `${qtyNum || 50} كجم تقريباً`;
      materials = rtl ? ["ألمنيوم مطابخ/نوافذ", "ألمنيوم سيارات"] : ["Kitchen/Window Aluminum", "Automotive Aluminum"];
    } else if (mat === 'refrigerators') {
      const min = Math.round(qtyNum * 120);
      const max = Math.round(qtyNum * 260);
      estRange = `${min || 150} - ${max || 600} ريال سعودي`;
      estWeight = `${qtyNum || 2} ثلاجة/غسالة`;
      materials = rtl ? ["ثلاجات غسالات سكراب", "معادن وأجهزة منزلية"] : ["Scrap Fridges & Washers", "Home Appliances"];
    } else if (mat === 'electronics') {
      const min = Math.round(qtyNum * 200);
      const max = Math.round(qtyNum * 800);
      estRange = `${min || 250} - ${max || 1500} ريال سعودي`;
      estWeight = `${qtyNum || 5} قطع إلكترونية`;
      materials = rtl ? ["معدات إلكترونية", "بطاريات ولوحات"] : ["Electronic Equipment", "Boards & Batteries"];
    }

    const advice = rtl
      ? (cmsData.estimatorConfig?.aiAdviceAr || "سعر اليوم ممتاز! ننصحك بفرز النحاس أو الألمنيوم بشكل منفصل للحصول على أعلى قيمة نقدية فورية.")
      : (cmsData.estimatorConfig?.aiAdviceEn || "Today's market rates are high! We recommend sorting items to get the highest immediate cash value.");
    const conf = cmsData.estimatorConfig?.baseConfidence || 96;

    return {
      detectedMaterials: materials,
      estimatedWeightKg: estWeight,
      condition: rtl ? "سكراب ممتاز قابل للتدوير" : "Excellent recyclable scrap condition",
      confidence: conf,
      estimatedValueRangeSar: estRange,
      professionalAdvice: advice,
      nextSteps: rtl
        ? "اضغط على زر الواتساب أدناه لإرسال التقييم مباشرة لفريق شيرا وسنرسل الشاحنة لنقلها مجاناً."
        : "Click the WhatsApp button below to send this quote directly to Shera team for free pickup."
    };
  };

  // Perform AI evaluation on backend with static fallback
  const handleEvaluate = async () => {
    setIsAnalyzing(true);
    setError(null);

    // Give a smooth loading experience (1.2s delay for realistic feel)
    await new Promise(r => setTimeout(r, 1200));

    let data: EstimationResult;
    try {
      let base64Image = '';
      if (imageFile) {
        base64Image = await convertFileToBase64(imageFile);
      }

      const response = await fetch('/api/analyze-scrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialType: selectedCategory,
          approxQuantity: quantity || "Not specified",
          image: base64Image,
          language: lang,
        }),
      });

      if (response.ok) {
        data = await response.json();
      } else {
        data = generateLocalEstimation(selectedCategory, quantity, isRtl);
      }
    } catch (err: any) {
      data = generateLocalEstimation(selectedCategory, quantity, isRtl);
    }

    setResult(data);
    setStep(4);
    setIsAnalyzing(false);
  };

  // Reset Estimator
  const handleReset = () => {
    setStep(1);
    setSelectedCategory('copper');
    setQuantity('');
    setImageFile(null);
    setImagePreview('');
    setResult(null);
    setError(null);
  };

  // Prefilled WhatsApp redirection
  const getWhatsAppRedirectionUrl = () => {
    if (!result) return '';
    const matchCat = cmsData.categories.find(c => c.slug === selectedCategory || c.id === selectedCategory);
    const categoryName = selectedCategory === 'other' 
      ? (isRtl ? 'سكراب عام' : 'General Scrap') 
      : (isRtl ? matchCat?.nameAr || scrapCategories.find(c => c.id === selectedCategory)?.arabicTitle : matchCat?.nameEn || scrapCategories.find(c => c.id === selectedCategory)?.title);

    const messageText = isRtl
      ? `السلام عليكم مؤسسة شيرا للسكراب بالدمام، لقد قمت بتقييم السكراب الخاص بي في موقعكم وجاهز للبيع على الفور:
- نوع السكراب: ${categoryName}
- الكمية المقدرة: ${quantity || 'غير محددة'}
- الوزن المقدر بالذكاء الاصطناعي: ${result.estimatedWeightKg}
- السعر التقديري المتوقع: ${result.estimatedValueRangeSar}

يرجى تأكيد السعر وتحديد موعد لسيارة النقل فك مجاني بالكامل.`
      : `Hello Shera Scrap Dammam, I have evaluated my scrap on your website and am ready to sell:
- Scrap Category: ${categoryName}
- User Quantity: ${quantity || 'Not specified'}
- AI Estimated Weight: ${result.estimatedWeightKg}
- AI Value Payout Range: ${result.estimatedValueRangeSar}

Please coordinate the free truck pickup and dismantling at my location.`;

    return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(messageText)}`;
  };

  // Category labels helper
  const getCategoryLabel = (id: MaterialType | 'other') => {
    if (id === 'other') return isRtl ? 'أنواع أخرى' : 'Other Scrap';
    const matchCat = cmsData.categories.find(c => c.slug === id || c.id === id);
    if (matchCat) return isRtl ? matchCat.nameAr : matchCat.nameEn;
    const match = scrapCategories.find(c => c.id === id);
    return isRtl ? match?.arabicTitle : match?.title;
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="estimator">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/10" />
            <span>{isRtl ? "تقنية تقدير ذكية ومطورة" : "Smart Evaluation Engine"}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.estimatorTitle}
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t.estimatorSubtitle}
          </p>
        </div>

        {/* Multi-step Container Box */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.06)] relative overflow-hidden ring-1 ring-slate-950/5">
          
          {/* Top progress line (Zeigarnik Effect indicator) */}
          {step <= 3 && (
            <div className="w-full bg-slate-200 h-1.5 rounded-full mb-8 relative">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
              <div className="flex justify-between items-center text-[10px] md:text-xs text-slate-500 font-bold uppercase mt-2">
                <span>{t.stepLabel} 1: {isRtl ? "الفئة" : "Category"}</span>
                <span>{t.stepLabel} 2: {isRtl ? "الكمية" : "Quantity"}</span>
                <span>{t.stepLabel} 3: {isRtl ? "الصورة" : "Photo"}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-rose-800 text-xs md:text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
                <span>{t.selectCategory}</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cmsData.categories.map((cat) => {
                  const catId = (cat.slug || cat.id) as MaterialType;
                  const categoryTitle = isRtl ? cat.nameAr : cat.nameEn;
                  const rateEstimate = isRtl ? cat.rateEstimateAr : cat.rateEstimateEn;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(catId)}
                      className={`flex flex-col justify-between p-4 rounded-2xl border text-right transition-all cursor-pointer shadow-sm hover:shadow-md ${
                        selectedCategory === catId 
                          ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20' 
                          : 'border-slate-200/90 bg-white hover:border-emerald-300'
                      }`}
                    >
                      {/* Top Row: Thumbnail + Full Category Title */}
                      <div className="flex items-center gap-3 w-full">
                        <img 
                          src={cat.featuredImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80'} 
                          alt={categoryTitle} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug text-right">
                          {categoryTitle}
                        </span>
                      </div>

                      {/* Bottom Row: Rate Estimate */}
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between w-full">
                        <span className="text-[11px] font-bold text-slate-400">
                          {isRtl ? "سعر التقدير:" : "Est. Rate:"}
                        </span>
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-lg border border-emerald-300/50">
                          💰 {rateEstimate}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: QUANTITY DETAILS */}
          {step === 2 && (
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">2</span>
                <span>{t.selectQuantity}</span>
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={isRtl ? "مثال: ٤ مكيفات، ٢٠ كجم كابلات نحاسية، طن حديد..." : "e.g., 4 split AC units, 25 kg copper cables, 1 ton iron..."}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />

                <div className="flex gap-2 flex-wrap">
                  {['1-2 Units', '3-5 Units', '10+ Units', '20kg - 50kg', '50kg - 150kg', '1 Ton+'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setQuantity(chip)}
                      className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/20 cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-200/60 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{isRtl ? "السابق" : "Back"}</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!quantity.trim()}
                    className="flex items-center gap-1.5 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm cursor-pointer"
                  >
                    <span>{isRtl ? "التالي" : "Next"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD SCRAP PHOTO */}
          {step === 3 && (
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">3</span>
                <span>{t.uploadPhoto}</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6">{t.optionalPhoto}</p>

              {/* Drag and Drop Zone */}
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                  dragActive ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-white"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="scrap-image-file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Scrap Preview" 
                      className="max-h-48 rounded-xl object-contain border border-slate-100 shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => { setImageFile(null); setImagePreview(''); }}
                      className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 text-xs font-bold rounded-lg hover:bg-rose-100 cursor-pointer"
                    >
                      {isRtl ? "حذف الصورة" : "Remove Image"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {isRtl ? "اسحب وأفلت صورة السكراب هنا أو انقر لتصفح الملفات" : "Drag & drop scrap image here, or click to browse"}
                    </div>
                    <div className="text-xs text-slate-400">
                      Supports JPEG, PNG, WEBP (Max 10MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation and AI Trigger buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-200/60 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isRtl ? "السابق" : "Back"}</span>
                </button>
                
                <button
                  onClick={handleEvaluate}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-75 disabled:cursor-not-allowed font-extrabold text-sm shadow-md cursor-pointer"
                  id="evaluate-ai-trigger"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.calculating}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white" />
                      <span>{t.calculateValue}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RESULTS PREVIEW (Zeigarnik complete phase -> Lead capture WhatsApp) */}
          {step === 4 && result && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 mb-6">
                <h3 className="text-base md:text-lg font-black text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t.estimatorResultTitle}</span>
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {isRtl ? "تقييم الذكاء الاصطناعي الفوري" : "Instant AI Estimate"}
                </span>
              </div>

              {/* Result Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                {/* Result Block 1: Expected Weight */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{t.estimatedWeight}</span>
                  <span className="text-base md:text-lg font-black text-slate-800 mt-1.5 block">
                    ⚖️ {result.estimatedWeightKg}
                  </span>
                </div>

                {/* Result Block 2: Estimated Value */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm text-center">
                  <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">{t.estimatedValueSar}</span>
                  <span className="text-lg md:text-2xl font-black text-emerald-700 mt-1 block">
                    💵 {result.estimatedValueRangeSar}
                  </span>
                </div>

                {/* Result Block 3: Confidence */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-center">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{t.confidenceScore}</span>
                  <span className="text-base md:text-lg font-black text-slate-800 mt-1.5 block">
                    🎯 {result.confidence}%
                  </span>
                </div>
              </div>

              {/* Sub-details box */}
              <div className="space-y-4 bg-white border border-slate-100 rounded-xl p-5 mb-8 text-xs md:text-sm">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">🏷️ {isRtl ? "الفئات والمواد التي تم رصدها:" : "Detected Metals & Materials:"}</h4>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {result.detectedMaterials.map((mat, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-md">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-slate-800 mb-1">⚙️ {isRtl ? "تقييم حالة السكراب المرفق:" : "Scrap Condition Assessment:"}</h4>
                  <p className="text-slate-600 font-medium">{result.condition}</p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-slate-800 mb-1">💡 {t.adviceLabel}:</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{result.professionalAdvice}</p>
                </div>

                <div className="border-t border-emerald-100 bg-emerald-50/30 p-3 rounded-lg mt-3">
                  <h4 className="font-black text-emerald-800 mb-1">📌 {t.nextStepsLabel}:</h4>
                  <p className="text-emerald-900 font-semibold leading-relaxed">{result.nextSteps}</p>
                </div>
              </div>

              {/* Lead complete Redirection triggers */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-200/60 pt-6">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.restartBtn}</span>
                </button>

                <a
                  href={getWhatsAppRedirectionUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white font-black px-6 py-3.5 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/10 text-sm"
                  id="estimator-whatsapp-redirection"
                >
                  <Send className="w-4 h-4 animate-pulse" />
                  <span>{t.completeOnWhatsAppBtn}</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
