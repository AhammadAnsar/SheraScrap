import React, { useState } from 'react';
import { Calculator, Save, CheckCircle2, Layers } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { EstimatorConfig } from '../../cms/types';

interface EstimatorManagerProps {
  lang: 'ar' | 'en';
}

export default function EstimatorManager({ lang }: EstimatorManagerProps) {
  const { cmsData, setCmsData } = useCMS();
  const isRtl = lang === 'ar';

  const [config, setConfig] = useState<EstimatorConfig>(
    cmsData.estimatorConfig || {
      aiAdviceAr: "الأسعار المعروضة تقديرية وفق بورصة المعادن بالشرقية اليوم. ننصح بتجميع الكميات الكبيرة للحصول على بونص إضافي كاش!",
      aiAdviceEn: "Estimates are calculated based on today's Eastern Province metal rates. Bulk quantities receive premium cash bonuses!",
      minWeightKg: 10,
      maxWeightKg: 5000,
      baseConfidence: 96,
      whatsappMessageHeaderAr: "مرحباً مؤسسة شيرا، قمت بحساب قيمة سكراب عبر الحاسبة الذكية بالموقع:",
      whatsappMessageHeaderEn: "Hello Shera Scrap, I evaluated my scrap using the AI Estimator on website:"
    }
  );

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setCmsData(prev => ({
      ...prev,
      estimatorConfig: config
    }));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? 'إدارة مقيّم الذكاء الاصطناعي (AI Scrap Estimator Manager)' : 'AI Estimator Manager'}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl ? 'التحكم في نصائح الحاسبة ونسبة الدقة ورسالة الواتساب التلقائية' : 'Manage AI Estimator advice, confidence ratios, and automated WhatsApp templates'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? 'حفظ إعدادات الحاسبة' : 'Save Estimator Config'}</span>
        </button>
      </div>

      {savedNotice && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'تم حفظ وتحديث إعدادات حاسبة السكراب بنجاح!' : 'Estimator config updated successfully!'}</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
        <h2 className="text-sm font-black text-white border-b border-slate-800 pb-2">
          {isRtl ? 'إعدادات النصائح والنص العربي والإنجليزية' : 'Estimator Advice & Text Templates'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isRtl ? 'النصيحة الاحترافية بالعربية' : 'Professional Advice (Arabic)'}
            </label>
            <textarea
              rows={3}
              value={config.aiAdviceAr}
              onChange={e => setConfig(prev => ({ ...prev, aiAdviceAr: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isRtl ? 'النصيحة الاحترافية بالإنجليزية' : 'Professional Advice (English)'}
            </label>
            <textarea
              rows={3}
              value={config.aiAdviceEn}
              onChange={e => setConfig(prev => ({ ...prev, aiAdviceEn: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isRtl ? 'مقدمة رسالة الواتساب (عربي)' : 'WhatsApp Template Header (Arabic)'}
            </label>
            <input
              type="text"
              value={config.whatsappMessageHeaderAr}
              onChange={e => setConfig(prev => ({ ...prev, whatsappMessageHeaderAr: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isRtl ? 'مقدمة رسالة الواتساب (إنجليزي)' : 'WhatsApp Template Header (English)'}
            </label>
            <input
              type="text"
              value={config.whatsappMessageHeaderEn}
              onChange={e => setConfig(prev => ({ ...prev, whatsappMessageHeaderEn: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isRtl ? 'نسبة ثقة الذكاء الاصطناعي (%)' : 'Base AI Confidence Score (%)'}
            </label>
            <input
              type="number"
              value={config.baseConfidence}
              onChange={e => setConfig(prev => ({ ...prev, baseConfidence: Number(e.target.value) }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Note about category pricing */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-white">
              {isRtl ? 'تعديل أسعار الكيلو لكل مادة سكراب' : 'Adjust Scrap Rates Per Kg'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRtl ? 'يتم تحديد أسعار النحاس والحديد والمكيفات من تبويب "الأقسام والأسعار (Categories)"' : 'Material rates per kg are dynamically configured in Categories tab'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
