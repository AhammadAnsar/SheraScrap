import React, { useState } from 'react';
import { Palette, CheckCircle2, Save, Layout, Sparkles, Sliders } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface CustomizationManagerProps {
  lang: 'ar' | 'en';
}

export default function CustomizationManager({ lang }: CustomizationManagerProps) {
  const { cmsData, updateTheme } = useCMS();
  const isRtl = lang === 'ar';

  const [themeConfig, setThemeConfig] = useState(cmsData.theme);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTheme(themeConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>{isRtl ? "تخصيص المظهر والثيم (Theme Customization)" : "Theme Customization"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "تحديد ألوان الهوية البصرية، أشكال الهيدر، الفوتر، وزر الواتساب العائم" 
              : "Customize primary brand color, header options, and floating WhatsApp button"}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? "حفظ مظهر الثيم" : "Save Theme"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? "تم حفظ تخصيصات الثيم بنجاح!" : "Theme options updated!"}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Color Presets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-white">
            {isRtl ? "اللون الرئيسي المعتمد للعلامة التجارية" : "Primary Brand Color Scheme"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'emerald', nameAr: 'الزمردي (الأصلي)', nameEn: 'Emerald Green', bg: 'bg-emerald-500' },
              { id: 'amber', nameAr: 'الذهبي الأصفر', nameEn: 'Amber Gold', bg: 'bg-amber-500' },
              { id: 'blue', nameAr: 'الأزرق الملكي', nameEn: 'Royal Blue', bg: 'bg-blue-600' },
              { id: 'purple', nameAr: 'البنفسجي الممتاز', nameEn: 'Deep Purple', bg: 'bg-purple-600' },
              { id: 'slate', nameAr: 'الرمادي الداكن', nameEn: 'Dark Slate', bg: 'bg-slate-700' },
            ].map((color) => (
              <button
                type="button"
                key={color.id}
                onClick={() => setThemeConfig({ ...themeConfig, primaryColor: color.id as any })}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  themeConfig.primaryColor === color.id 
                    ? 'border-emerald-500 bg-slate-800/90 ring-2 ring-emerald-500/40' 
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${color.bg} shadow-md`} />
                <span>{isRtl ? color.nameAr : color.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Controls & Footer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-white">
            {isRtl ? "عناصر التحكم العائمة والفوتر" : "Floating Controls & Footer"}
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={themeConfig.enableFloatingWhatsapp}
                onChange={(e) => setThemeConfig({ ...themeConfig, enableFloatingWhatsapp: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-200">
                {isRtl ? "تفعيل زر الواتساب العائم أسفل الشاشة" : "Enable Floating WhatsApp Button"}
              </span>
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "حقوق الفوتر (عربي)" : "Footer Copyright Text (Arabic)"}
              </label>
              <input
                type="text"
                value={themeConfig.footerTextAr}
                onChange={(e) => setThemeConfig({ ...themeConfig, footerTextAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "حقوق الفوتر (إنجليزي)" : "Footer Copyright Text (English)"}
              </label>
              <input
                type="text"
                value={themeConfig.footerTextEn}
                onChange={(e) => setThemeConfig({ ...themeConfig, footerTextEn: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm cursor-pointer"
        >
          {isRtl ? "تطبيق وتحديث مظهر الموقع" : "Apply & Update Theme"}
        </button>

      </form>
    </div>
  );
}
