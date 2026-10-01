import React from 'react';
import { LayoutDashboard, LogOut, Settings, MessageSquare, Plus, ExternalLink, Globe, User, Palette } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface AdminBarProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
}

export default function AdminBar({ lang, setLang }: AdminBarProps) {
  const { currentUser, isAdminOpen, setIsAdminOpen, setActiveAdminTab, logout, cmsData } = useCMS();

  const newInquiriesCount = cmsData.inquiries.filter(i => i.status === 'new').length;

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800 flex justify-between items-center z-50 sticky top-0 shadow-md select-none font-sans" dir="ltr">
      {/* Left / Start Controls */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {/* SoftDows Icon & Main Toggle */}
        <button
          onClick={() => setIsAdminOpen(!isAdminOpen)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded font-extrabold transition-all cursor-pointer shrink-0"
          title={isAdminOpen ? "View Public Site" : "Open Admin Panel"}
        >
          {cmsData.settings.siteLogo ? (
            <img src={cmsData.settings.siteLogo} alt="Logo" className="w-4 h-4 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
              S
            </div>
          )}
          <span className="hidden sm:inline">
            {isAdminOpen ? "View Public Site" : "Admin Panel"}
          </span>
          <ExternalLink className="w-3 h-3 text-emerald-400" />
        </button>

        {/* Quick Nav shortcuts when in Admin Mode or Public Site */}
        <div className="hidden md:flex items-center gap-1 border-r border-l border-slate-800 px-2">
          <button
            onClick={() => { setIsAdminOpen(true); setActiveAdminTab('settings'); }}
            className="hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded flex items-center gap-1 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => { setIsAdminOpen(true); setActiveAdminTab('posts'); }}
            className="hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Post</span>
          </button>

          <button
            onClick={() => { setIsAdminOpen(true); setActiveAdminTab('customization'); }}
            className="hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded flex items-center gap-1 transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Customize</span>
          </button>

          <button
            onClick={() => { setIsAdminOpen(true); setActiveAdminTab('inquiries'); }}
            className="hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded flex items-center gap-1 transition-all cursor-pointer relative"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span>Inquiries</span>
            {newInquiriesCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 animate-bounce">
                {newInquiriesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Right / End Profile & Logout */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
          ) : (
            <User className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="font-bold text-[11px] text-white hidden sm:inline">{currentUser.name}</span>
          <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
            {currentUser.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-2 py-1 rounded transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
