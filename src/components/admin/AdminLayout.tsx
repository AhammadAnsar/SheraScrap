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
  lang?: 'ar' | 'en';
  setLang?: (lang: 'ar' | 'en') => void;
}

export default function AdminLayout({ lang = 'en', setLang }: AdminLayoutProps) {
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

  // Enforce English LTR in backend administration
  const isRtl = false;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const newInquiriesCount = cmsData.inquiries.filter(i => i.status === 'new').length;
  const newClientsCount = (cmsData.clients || []).filter(c => c.status === 'new_lead').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'settings', label: 'Website & SEO Settings', icon: Settings },
    { id: 'sections', label: 'Section Manager', icon: LayoutGrid },
    { id: 'pages', label: 'Pages Management', icon: FileCode },
    { id: 'posts', label: 'Post & Video Management', icon: FileText },
    { id: 'media', label: 'Media Library', icon: FileImage },
    { id: 'categories', label: 'Scrap Categories & Rates', icon: Layers },
    { id: 'equipments', label: 'Equipment & Fleet', icon: Truck },
    { 
      id: 'clients', 
      label: 'Clients Management', 
      icon: Building,
      badge: newClientsCount > 0 ? newClientsCount : null 
    },
    { id: 'slider', label: 'Hero Slider', icon: Sliders },
    { 
      id: 'inquiries', 
      label: 'Customer Leads & Inquiries', 
      icon: MessageSquare, 
      badge: newInquiriesCount > 0 ? newInquiriesCount : null 
    },
    { id: 'users', label: 'User & Staff Management', icon: Users },
    { id: 'customization', label: 'Theme Customization', icon: Palette },
    { id: 'backup', label: 'Backup & Restore', icon: FileJson },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden" dir="ltr">
      
      {/* Admin Panel Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-30 shrink-0">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
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
                Shera Scrap CMS Engine
              </h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {cmsData.settings.siteTitleEn || "Dammam Scrap & Equipment Commercial Operations"}
              </p>
            </div>
          </div>
        </div>

        {/* Top Navbar Actions */}
        <div className="flex items-center gap-2.5">
          {/* Automatic Live Server Sync Status Indicator */}
          <div 
            className={`text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 border transition-all ${
              saveStatus === 'saving'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                : saveStatus === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
            title="All changes are automatically synced to the server"
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
                ? "Auto-Saving..."
                : saveStatus === 'error'
                ? "Sync Error"
                : "Auto-Saved to Server"}
            </span>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">View Public Site</span>
          </button>

          <button
            onClick={logout}
            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
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

        {/* CMS Sidebar */}
        <aside className={`
          absolute md:relative inset-y-0 left-0 z-20
          w-64 bg-slate-900 border-r border-slate-800/80 p-3 flex flex-col justify-between
          transition-transform duration-200 transform md:transform-none
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-3 py-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              CMS Navigation
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
                    w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between
                    ${isActive 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-black' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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
                className="w-8 h-8 rounded-xl object-cover border border-slate-800 shrink-0"
              />
              <div className="overflow-hidden">
                <span className="block text-xs font-extrabold text-white truncate">{currentUser?.name}</span>
                <span className="block text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider">
                  {currentUser?.role}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Render Workspace */}
        <main className="flex-grow bg-slate-950 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeAdminTab === 'dashboard' && <DashboardOverview lang="en" />}
            {(activeAdminTab === 'seo' || activeAdminTab === 'search-analytics' || activeAdminTab === 'sitemap') && (
              <WebsiteSettingsManager lang="en" initialTab="seo" />
            )}
            {activeAdminTab === 'settings' && <WebsiteSettingsManager lang="en" initialTab="general" />}
            {activeAdminTab === 'sections' && <SectionManager lang="en" initialTab="contact" />}
            {activeAdminTab === 'contact' && <SectionManager lang="en" initialTab="contact" />}
            {activeAdminTab === 'testimonials' && <SectionManager lang="en" initialTab="testimonials" />}
            {activeAdminTab === 'estimator' && <SectionManager lang="en" initialTab="estimator" />}
            {activeAdminTab === 'whyus' && <SectionManager lang="en" initialTab="whyus" />}
            {activeAdminTab === 'faq' && <SectionManager lang="en" initialTab="faq" />}
            {activeAdminTab === 'pages' && <PageManager lang="en" />}
            {activeAdminTab === 'posts' && <PostManager lang="en" />}
            {activeAdminTab === 'media' && <MediaTab lang="en" />}
            {activeAdminTab === 'categories' && <CategoryManager lang="en" />}
            {activeAdminTab === 'equipments' && <EquipmentManager lang="en" />}
            {activeAdminTab === 'clients' && <ClientManager lang="en" />}
            {activeAdminTab === 'slider' && <SliderManager lang="en" />}
            {activeAdminTab === 'inquiries' && <InquiryManager lang="en" />}
            {activeAdminTab === 'users' && <UserManager lang="en" />}
            {activeAdminTab === 'customization' && <CustomizationManager lang="en" />}
            {activeAdminTab === 'backup' && <BackupRestoreManager lang="en" />}
          </div>
        </main>

      </div>

    </div>
  );
}
