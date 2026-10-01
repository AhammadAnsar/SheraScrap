import React, { useState } from 'react';
import { 
  Save, 
  Settings, 
  Phone, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  Megaphone, 
  Search, 
  Image as ImageIcon, 
  Code, 
  FileCode, 
  MapPin, 
  ArrowRightLeft, 
  FileText, 
  Sparkles,
  Plus,
  Trash2,
  Bot
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import ImageUploader from './ImageUploader';
import SeoCenterManager from './SeoCenterManager';
import { RedirectionItem } from '../../cms/types';

interface WebsiteSettingsManagerProps {
  lang: 'ar' | 'en';
  initialTab?: 'general' | 'seo';
}

export default function WebsiteSettingsManager({ lang, initialTab = 'general' }: WebsiteSettingsManagerProps) {
  const { cmsData, updateSettings } = useCMS();
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'general' | 'seo'>(initialTab);
  const [seoSubTab, setSeoSubTab] = useState<'webmasters' | 'analytics' | 'image_seo' | 'llms_txt' | 'local_seo' | 'redirections' | 'schema' | 'sitemap' | 'keywords' | 'robots'>('webmasters');

  const [formData, setFormData] = useState(cmsData.settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Keep form data in sync with CMS context if updated externally
  React.useEffect(() => {
    setFormData(cmsData.settings);
  }, [cmsData.settings]);

  // Redirection creation state
  const [newFromUrl, setNewFromUrl] = useState('');
  const [newToUrl, setNewToUrl] = useState('');
  const [newRedirectType, setNewRedirectType] = useState<'301' | '302'>('301');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const addRedirection = () => {
    if (!newFromUrl || !newToUrl) return;
    const newRed: RedirectionItem = {
      id: `red-${Date.now()}`,
      fromUrl: newFromUrl,
      toUrl: newToUrl,
      type: newRedirectType,
      active: true
    };
    setFormData(prev => ({
      ...prev,
      redirections: [...(prev.redirections || []), newRed]
    }));
    setNewFromUrl('');
    setNewToUrl('');
  };

  const removeRedirection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      redirections: (prev.redirections || []).filter(r => r.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? "إعدادات الموقع الشاملة (Website Settings)" : "Website Settings"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "التحكم في الإعدادات العامة للموقع والأيقونات والشعار، بالإضافة إلى حزمة SEO المتكاملة" 
              : "Manage General Site Settings, Favicon, Logo, and full SEO Optimization Suite"}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isRtl ? "حفظ جميع الإعدادات" : "Save All Settings"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? "تم حفظ وتطبيق جميع إعدادات الموقع بنجاح!" : "All site & SEO settings saved successfully!"}</span>
        </div>
      )}

      {/* Main Tabs Navigation (General vs SEO) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'general' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{isRtl ? "General Setting (الإعدادات العامة)" : "General Settings"}</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'seo' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{isRtl ? "SEO Optimization (تهيئة محركات البحث)" : "SEO Optimization"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ========================================================== */}
        {/* TAB 1: GENERAL SETTINGS                                     */}
        {/* ========================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Branding & Titles */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? "عناوين الموقع والشعار (Site Title & Tagline)" : "Site Title & Tagline"}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "Site Title (اسم الموقع بالعربية)" : "Site Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="siteTitleAr"
                    value={formData.siteTitleAr}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "Site Title (اسم الموقع بالإنجليزي)" : "Site Title (English)"}
                  </label>
                  <input
                    type="text"
                    name="siteTitleEn"
                    value={formData.siteTitleEn}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "Tagline (الشعار اللفظي بالعربية)" : "Tagline (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="siteTaglineAr"
                    value={formData.siteTaglineAr}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "Tagline (الشعار اللفظي بالإنجليزي)" : "Tagline (English)"}
                  </label>
                  <input
                    type="text"
                    name="siteTaglineEn"
                    value={formData.siteTaglineEn}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Media Icons & Logos (Site Icon Fav Icon & Site Logo Header/Footer) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>{isRtl ? "أيقونة وشعار الموقع (Site Icon & Site Logo)" : "Site Icon & Logo Assets"}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader
                  label={isRtl ? "Site Icon (أيقونة الفافيكون Fav Icon)" : "Site Icon (Favicon)"}
                  value={formData.siteIcon || ''}
                  onChange={(url) => {
                    setFormData(prev => ({ ...prev, siteIcon: url }));
                    updateSettings({ siteIcon: url });
                  }}
                  isRtl={isRtl}
                />

                <ImageUploader
                  label={isRtl ? "Site Logo (شعار الهيدر والفوتر الرئيسي)" : "Site Logo (Header & Footer Logo)"}
                  value={formData.siteLogo || ''}
                  onChange={(url) => {
                    setFormData(prev => ({ ...prev, siteLogo: url }));
                    updateSettings({ siteLogo: url });
                  }}
                  isRtl={isRtl}
                />
              </div>
            </div>

            {/* Phone & Location */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? "أرقام التواصل والتنبيهات" : "Contact & Announcement Settings"}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "رقم الجوال والاتصال" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "رقم الواتساب" : "WhatsApp Number"}
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>{isRtl ? "شريط التنبيهات العريض" : "Announcement Bar"}</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="showAnnouncementBar"
                      checked={formData.showAnnouncementBar}
                      onChange={handleChange}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-300">{isRtl ? "تفعيل الشريط" : "Show Banner"}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="announcementBarAr"
                    value={formData.announcementBarAr}
                    onChange={handleChange}
                    placeholder={isRtl ? "نص التنبيه بالعربية" : "Banner text (Arabic)"}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    name="announcementBarEn"
                    value={formData.announcementBarEn}
                    onChange={handleChange}
                    placeholder={isRtl ? "نص التنبيه بالإنجليزي" : "Banner text (English)"}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Footer & Social Media Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>{isRtl ? "إعدادات فوتر الموقع ونصوص عن الشركة والتواصل الاجتماعي" : "Footer & Social Settings"}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "نبذة عن الشركة بالفوتر (عربي)" : "Footer About Text (Arabic)"}
                  </label>
                  <textarea
                    rows={2}
                    name="footerAboutAr"
                    value={formData.footerAboutAr || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "نبذة عن الشركة بالفوتر (إنجليزي)" : "Footer About Text (English)"}
                  </label>
                  <textarea
                    rows={2}
                    name="footerAboutEn"
                    value={formData.footerAboutEn || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "نص حقوق الطبع (عربي)" : "Copyright Text (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="copyrightAr"
                    value={formData.copyrightAr || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "نص حقوق الطبع (إنجليزي)" : "Copyright Text (English)"}
                  </label>
                  <input
                    type="text"
                    name="copyrightEn"
                    value={formData.copyrightEn || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "العنوان والموقع (عربي)" : "Location (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="locationAr"
                    value={formData.locationAr || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "أوقات العمل (عربي)" : "Working Hours (Arabic)"}
                  </label>
                  <input
                    type="text"
                    name="workingHoursAr"
                    value={formData.workingHoursAr || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  />
                </div>
              </div>

              {/* Social links */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    name="facebookUrl"
                    value={formData.facebookUrl || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">X (Twitter) URL</label>
                  <input
                    type="text"
                    name="twitterUrl"
                    value={formData.twitterUrl || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    name="instagramUrl"
                    value={formData.instagramUrl || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: SEO OPTIMIZATION SUITE                               */}
        {/* ========================================================== */}
        {activeTab === 'seo' && (
          <div className="animate-in fade-in">
            <SeoCenterManager lang={lang} defaultTab="meta" />
          </div>
        )}

        {/* Global Save Action for General Settings */}
        {activeTab === 'general' && (
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? "حفظ وتطبيق إعدادات الموقع العامة" : "Save General Settings"}</span>
          </button>
        )}

      </form>
    </div>
  );
}
