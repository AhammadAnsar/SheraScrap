import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Sliders, 
  FileText, 
  Layers, 
  MessageSquare, 
  Users, 
  Palette, 
  FileJson, 
  X, 
  ExternalLink, 
  Globe, 
  LogOut,
  ChevronRight,
  Menu,
  FileCode,
  Video,
  Building,
  FileImage,
  Save,
  Check,
  Loader2,
  Search,
  Sparkles,
  Truck
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

import DashboardOverview from './DashboardOverview';
import WebsiteSettingsManager from './WebsiteSettingsManager';
import PageManager from './PageManager';
import SliderManager from './SliderManager';
import PostManager from './PostManager';
import CategoryManager from './CategoryManager';
import ClientManager from './ClientManager';
import InquiryManager from './InquiryManager';
import UserManager from './UserManager';
import CustomizationManager from './CustomizationManager';
import BackupRestoreManager from './BackupRestoreManager';
import MediaTab from './MediaTab';
import SearchAnalyticsManager from './SearchAnalyticsManager';
import SitemapManager from './SitemapManager';
import SeoCenterManager from './SeoCenterManager';
import EquipmentManager from './EquipmentManager';
import FaqManager from './FaqManager';
import WhyUsManager from './WhyUsManager';
import EstimatorManager from './EstimatorManager';
import SectionManager from './SectionManager';
import { HelpCircle, Calculator, ShieldCheck, Star, Quote, LayoutGrid } from 'lucide-react';

interface AdminLayoutProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
}

export default function AdminLayout({ lang, setLang }: AdminLayoutProps) {
  const { 
    currentUser, 
    setIsAdminOpen, 
    activeAdminTab, 
    setActiveAdminTab, 
    logout,
    cmsData,
    saveStatus,
    forceServerSync
  } = useCMS();

  const isRtl = lang === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const newInquiriesCount = cmsData.inquiries.filter(i => i.status === 'new').length;
  const newClientsCount = (cmsData.clients || []).filter(c => c.status === 'new_lead').length;

  const navItems = [
    { id: 'dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', labelAr: 'إعدادات الموقع وتهيئة السيو (Website & SEO Settings)', labelEn: 'Website & SEO Settings', icon: Settings },
    { id: 'sections', labelAr: 'إدارة أقسام الموقع (Section Manager)', labelEn: 'Section Manager', icon: LayoutGrid },
    { id: 'pages', labelAr: 'إدارة الصفحات (Pages)', labelEn: 'Pages Management', icon: FileCode },
    { id: 'posts', labelAr: 'إدارة المقالات والفيديوهات (Post Management)', labelEn: 'Post & Video Management', icon: FileText },
    { id: 'media', labelAr: 'مكتبة الوسائط والصور (Media)', labelEn: 'Media Library', icon: FileImage },
    { id: 'categories', labelAr: 'الأقسام والأسعار (Categories)', labelEn: 'Categories', icon: Layers },
    { id: 'equipments', labelAr: 'إدارة المعدات والآليات (Equipment)', labelEn: 'Equipment & Fleet', icon: Truck },
    { 
      id: 'clients', 
      labelAr: 'إدارة العملاء (Clients)', 
      labelEn: 'Clients Management', 
      icon: Building,
      badge: newClientsCount > 0 ? newClientsCount : null 
    },
    { id: 'slider', labelAr: 'شرائح السلايدر', labelEn: 'Hero Slider', icon: Sliders },
    { 
      id: 'inquiries', 
      labelAr: 'طلبات العملاء', 
      labelEn: 'Inquiries & Leads', 
      icon: MessageSquare, 
      badge: newInquiriesCount > 0 ? newInquiriesCount : null 
    },
    { id: 'users', labelAr: 'المستخدمين والأدمن', labelEn: 'User Management', icon: Users },
    { id: 'customization', labelAr: 'تخصيص الثيم', labelEn: 'Theme Customization', icon: Palette },
    { id: 'backup', labelAr: 'نسخ احتياطي واستعادة', labelEn: 'Backup & Restore', icon: FileJson },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* Admin Panel Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-30 shrink-0">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {cmsData.settings.siteLogo ? (
              <img 
                src={cmsData.settings.siteLogo} 
                alt="Site Logo" 
                className="w-8 h-8 object-contain rounded-xl shrink-0 bg-slate-900 border border-slate-800" 
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-emerald-500/20">
                S
              </div>
            )}
            <div>
              <h2 className="font-black text-white text-sm leading-none">
                {isRtl ? "لوحة تحكم SoftDows CMS" : "SoftDows CMS Engine"}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {cmsData.settings.siteTitleAr}
              </p>
            </div>
          </div>
        </div>

        {/* Top Navbar Actions */}
        <div className="flex items-center gap-2">
          {/* Automatic Live Server Sync Status Indicator (WordPress Style) */}
          <div 
            className={`text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 border transition-all ${
              saveStatus === 'saving'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                : saveStatus === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
            title={isRtl ? "يتم حفظ جميع التغييرات تلقائياً في السيرفر مثل ووردبريس" : "All changes are automatically saved to server like WordPress"}
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : saveStatus === 'error' ? (
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {saveStatus === 'saving'
                ? (isRtl ? "جاري الحفظ تلقائياً..." : "Auto-Saving...")
                : saveStatus === 'error'
                ? (isRtl ? "خطأ في الاتصال" : "Sync Error")
                : (isRtl ? "محفوظ تلقائياً بالسيرفر" : "Auto-Saved to Server")}
            </span>
          </div>

          

          <button
            onClick={() => setIsAdminOpen(false)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{isRtl ? "معاينة الموقع" : "View Site"}</span>
          </button>

          <button
            onClick={logout}
            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Panel Content Body */}
      <div className="flex-grow flex overflow-hidden relative">
        
        {mobileMenuOpen && (
          <div 
            className="md:hidden absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        {/* WordPress Sidebar */}
        <aside className={`
          absolute md:relative inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-20
          w-64 bg-slate-900 border-r border-l border-slate-800/80 p-3 flex flex-col justify-between
          transition-transform duration-200 transform md:transform-none
          ${mobileMenuOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
        `}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {isRtl ? "قائمة الإدارة والتخصيص" : "CMS Navigation"}
            </div>

            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveAdminTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-start px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between
                    ${isActive 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-black' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{isRtl ? item.labelAr : item.labelEn}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-950 text-emerald-400' : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Card Footer */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'} 
                alt="Profile" 
                className="w-8 h-8 rounded-xl object-cover border border-slate-800"
              />
              <div className="overflow-hidden">
                <span className="block text-xs font-extrabold text-white truncate">{currentUser?.name}</span>
                <span className="block text-[9px] text-emerald-400 font-extrabold uppercase">
                  {currentUser?.role}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Render Workspace */}
        <main className="flex-grow bg-slate-950 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeAdminTab === 'dashboard' && <DashboardOverview lang={lang} />}
            {(activeAdminTab === 'seo' || activeAdminTab === 'search-analytics' || activeAdminTab === 'sitemap') && (
              <WebsiteSettingsManager lang={lang} initialTab="seo" />
            )}
            {activeAdminTab === 'settings' && <WebsiteSettingsManager lang={lang} initialTab="general" />}
            {activeAdminTab === 'sections' && <SectionManager lang={lang} initialTab="contact" />}
            {activeAdminTab === 'contact' && <SectionManager lang={lang} initialTab="contact" />}
            {activeAdminTab === 'testimonials' && <SectionManager lang={lang} initialTab="testimonials" />}
            {activeAdminTab === 'estimator' && <SectionManager lang={lang} initialTab="estimator" />}
            {activeAdminTab === 'whyus' && <SectionManager lang={lang} initialTab="whyus" />}
            {activeAdminTab === 'faq' && <SectionManager lang={lang} initialTab="faq" />}
            {activeAdminTab === 'pages' && <PageManager lang={lang} />}
            {activeAdminTab === 'posts' && <PostManager lang={lang} />}
            {activeAdminTab === 'media' && <MediaTab lang={lang} />}
            {activeAdminTab === 'categories' && <CategoryManager lang={lang} />}
            {activeAdminTab === 'equipments' && <EquipmentManager lang={lang} />}
            {activeAdminTab === 'clients' && <ClientManager lang={lang} />}
            {activeAdminTab === 'slider' && <SliderManager lang={lang} />}
            {activeAdminTab === 'inquiries' && <InquiryManager lang={lang} />}
            {activeAdminTab === 'users' && <UserManager lang={lang} />}
            {activeAdminTab === 'customization' && <CustomizationManager lang={lang} />}
            {activeAdminTab === 'backup' && <BackupRestoreManager lang={lang} />}
          </div>
        </main>

      </div>

    </div>
  );
}
