import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, Clock, Share2, Save, CheckCircle2, Globe, Map, MessageSquare } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface ContactUsManagerProps {
  lang: 'ar' | 'en';
}

export default function ContactUsManager({ lang }: ContactUsManagerProps) {
  const { cmsData, updateSettings } = useCMS();
  const isRtl = lang === 'ar';
  
  const [formData, setFormData] = useState(cmsData.settings);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(cmsData.settings);
  }, [cmsData.settings]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title & Save Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? "إدارة قسم تواصل معنا والخرائط وشبكات التواصل" : "Contact Us, Map & Social Media Management"}</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl
              ? "تحكم في أرقام الاتصال المباشر، الواتساب، العناوين، رابط خريطة الموقع، وحسابات شبكات التواصل الاجتماعي"
              : "Manage direct hotline numbers, WhatsApp, addresses, Google Map iframe link, and social media URLs"}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto text-xs"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? "حفظ التغييرات" : "Save Contact Settings"}</span>
        </button>
      </div>

      {isSavedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{isRtl ? "تم حفظ وتحديث بيانات الاتصال والخرائط بنجاح والتوافق مع الموقع مباشرة!" : "Contact settings and map configuration saved successfully!"}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Controls (Colspan 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: Phone Numbers & Direct Email */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "أرقام الاتصال والبريد الإلكتروني" : "Direct Phones & Official Email"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Direct Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? "رقم الجوال والاتصال المباشر" : "Hotline / Phone Number"}</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="0573690164"
                />
              </div>

              {/* WhatsApp Dispatcher */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? "رقم الواتساب (صيغة دولية بدون +)" : "WhatsApp Number (International format)"}</label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="966573690164"
                />
              </div>

              {/* Official Email */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? "البريد الإلكتروني الرسمي" : "Official Email Address"}</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="info@sherascrap.com"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Physical Location & Working Hours */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "عنوان المقر وساعات العمل" : "Workshop Location & Working Hours"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address Ar */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? "العنوان بالتفصيل (بالعربية)" : "Location Address (Arabic)"}</label>
                <textarea
                  rows={2}
                  value={formData.locationAr || ''}
                  onChange={(e) => handleChange('locationAr', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="الدمام - حي الخالدية - المنطقة الشرقية"
                />
              </div>

              {/* Address En */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? "العنوان بالتفصيل (بالإنجليزية)" : "Location Address (English)"}</label>
                <textarea
                  rows={2}
                  value={formData.locationEn || ''}
                  onChange={(e) => handleChange('locationEn', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="Dammam - Al Khaldiyah - Eastern Province"
                />
              </div>

              {/* Working Hours Ar */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? "ساعات العمل (بالعربية)" : "Working Hours (Arabic)"}</label>
                <input
                  type="text"
                  value={formData.workingHoursAr || ''}
                  onChange={(e) => handleChange('workingHoursAr', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="24 ساعة / 7 أيام في الأسبوع"
                />
              </div>

              {/* Working Hours En */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">{isRtl ? "ساعات العمل (بالإنجليزية)" : "Working Hours (English)"}</label>
                <input
                  type="text"
                  value={formData.workingHoursEn || ''}
                  onChange={(e) => handleChange('workingHoursEn', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="24 Hours / 7 Days a Week"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Google Map Embed URL */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Map className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "خريطة Google Map (Iframe Embed)" : "Google Maps Embed URL"}</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {isRtl ? "رابط التضمين الخاص بخريطة الموقع (Google Maps Embed URL)" : "Google Maps Iframe Embed URL"}
              </label>
              <input
                type="text"
                value={formData.googleMapEmbedUrl || ''}
                onChange={(e) => handleChange('googleMapEmbedUrl', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                placeholder="https://maps.google.com/maps?q=King%20Khaled%20St,%20Al%20Athir,%20Dammam...&output=embed"
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isRtl 
                  ? "💡 نصيحة: يمكنك نسخ رابط الخريطة من Google Maps بالنقر على شارك (Share) ثم تضمين خريطة (Embed a map) ونسخ رابط src فقط."
                  : "💡 Tip: Go to Google Maps -> Share -> Embed a map -> Copy the src URL from the iframe tag."}
              </p>
            </div>
          </div>

          {/* SECTION 4: Social Media Accounts */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "حسابات شبكات التواصل الاجتماعي" : "Social Media Profiles"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Facebook */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="https://facebook.com/sherascrap"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">YouTube URL</label>
                <input
                  type="url"
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="https://youtube.com/@sherascrap"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="https://instagram.com/sherascrap"
                />
              </div>

              {/* TikTok */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">TikTok URL</label>
                <input
                  type="url"
                  value={formData.tiktokUrl || ''}
                  onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="https://tiktok.com/@sherascrap"
                />
              </div>

              {/* Twitter / X */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block">Twitter / X URL</label>
                <input
                  type="url"
                  value={formData.twitterUrl || ''}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                  placeholder="https://twitter.com/sherascrap"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Interactive Preview Card (Colspan 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>{isRtl ? "معاينة حية لقسم التواصل والخرائط" : "Live Preview"}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>

            {/* Simulated Front-End Card */}
            <div className="bg-white text-slate-900 p-5 rounded-2xl space-y-4 shadow-lg text-xs">
              
              <div className="border-b border-slate-100 pb-2">
                <h4 className="font-black text-sm text-slate-900">
                  {isRtl ? "تفاصيل الاتصال والمقر" : "Office & Workshop Contact"}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isRtl ? formData.locationAr : formData.locationEn}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-extrabold text-emerald-700">{formData.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-slate-700">{formData.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-slate-700">{isRtl ? formData.workingHoursAr : formData.workingHoursEn}</span>
                </div>
              </div>

              {/* Social Media Badges */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {isRtl ? "وسائل التواصل المفعلة" : "Social Links"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.facebookUrl && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Facebook</span>}
                  {formData.youtubeUrl && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">YouTube</span>}
                  {formData.instagramUrl && <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-[10px] font-bold">Instagram</span>}
                  {formData.tiktokUrl && <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[10px] font-bold">TikTok</span>}
                </div>
              </div>

              {/* Simulated Map */}
              <div className="h-32 bg-slate-900 rounded-xl overflow-hidden relative border border-slate-200">
                <iframe
                  src={formData.googleMapEmbedUrl || "https://maps.google.com/maps?q=King%20Khaled%20St,%20Al%20Athir,%20Dammam%2032248,%20Saudi%20Arabia&t=&z=15&ie=UTF8&iwloc=&output=embed"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Preview map"
                />
              </div>

            </div>

            <button
              type="submit"
              onClick={handleSave}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl transition-all shadow-md text-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? "تأكيد وحفظ كل التعديلات" : "Save All Changes"}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
