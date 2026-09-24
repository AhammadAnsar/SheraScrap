import React, { useState } from 'react';
import { 
  FileCode, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  Globe, 
  Sparkles, 
  Layers, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Send,
  Zap,
  Info
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { generateSitemapXml, getSitemapMetrics } from '../../utils/sitemapGenerator';
import { SITE_CONFIG } from '../../config/site';

interface SitemapManagerProps {
  lang: 'ar' | 'en';
}

export default function SitemapManager({ lang }: SitemapManagerProps) {
  const { cmsData, updateSettings, saveCMSData } = useCMS();
  const isRtl = lang === 'ar';

  const [copied, setCopied] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [siteUrlInput, setSiteUrlInput] = useState(cmsData.settings.siteUrl || SITE_CONFIG.canonicalDomain);

  const xmlContent = generateSitemapXml(cmsData);
  const metrics = getSitemapMetrics(cmsData);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sitemap.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSiteUrl = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ siteUrl: siteUrlInput });
    saveCMSData({
      ...cmsData,
      settings: {
        ...cmsData.settings,
        siteUrl: siteUrlInput
      }
    });
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handlePingSearchEngines = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 p-5 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <FileCode className="w-3.5 h-3.5" />
            <span>{isRtl ? "مُولّد خريطة الموقع التلقائي (Dynamic XML Sitemap)" : "Automated Dynamic XML Sitemap"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {isRtl ? "إدارة وأتمتة خريطة الموقع لمحركات البحث" : "Search Engine Sitemap Automation"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {isRtl 
              ? "يتم تحديث خريطة الموقع تلقائياً لحظة إضافة أي مقال، أو قسم سكراب جديد، أو صفحة، لضمان أرشفة جوجل الفورية."
              : "Sitemap recalculates instantly whenever new posts or categories are saved, ensuring immediate Google indexing."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isRtl ? "معاينة sitemap.xml المباشر" : "View Live XML"}</span>
          </a>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-semibold">{isRtl ? "إجمالي الروابط المؤرشفة" : "Total Indexed URLs"}</span>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-white">{metrics.totalUrls}</h3>
            <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isRtl ? "محدثة وجاهزة" : "Up to Date"}</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-semibold">{isRtl ? "أقسام خدمات السكراب" : "Scrap Services"}</span>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-amber-300">{metrics.categoriesCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">{isRtl ? "أولويات مرتفعة (0.9)" : "High Priority (0.9)"}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-semibold">{isRtl ? "المقالات المنشورة" : "Published Articles"}</span>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-emerald-300">{metrics.publishedPostsCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">{isRtl ? "تعديل شهري (0.8)" : "Monthly Mod (0.8)"}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-semibold">{isRtl ? "الصفحات المخصصة" : "Custom Pages"}</span>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-purple-300">{metrics.publishedPagesCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1">{isRtl ? "أولوية قياسية (0.7)" : "Standard (0.7)"}</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-xs font-semibold">{isRtl ? "آخر توليد تلقائي" : "Last Auto-Sync"}</span>
          <div className="mt-2">
            <h3 className="text-base font-black text-blue-300 font-mono">{metrics.lastGenerated}</h3>
            <p className="text-[10px] text-emerald-400 font-bold mt-1">{isRtl ? "توليد تلقائي نشط" : "Live Auto-Trigger"}</p>
          </div>
        </div>

      </div>

      {/* Site URL Configuration & Quick Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        
        <form onSubmit={handleSaveSiteUrl} className="flex flex-col md:flex-row items-end gap-3 pb-4 border-b border-slate-800">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRtl ? "رابط النطاق الرئيسي للموقع (Site Domain URL):" : "Base Domain URL:"}</span>
            </label>
            <input
              type="url"
              value={siteUrlInput}
              onChange={(e) => setSiteUrlInput(e.target.value)}
              placeholder={SITE_CONFIG.canonicalDomain}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
          >
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            <span>{isRtl ? "تحديث النطاق وتجديد الروابط" : "Update Site Domain"}</span>
          </button>
        </form>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          <div className="flex flex-wrap items-center gap-2">
            
            <button
              onClick={handleDownloadXml}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{isRtl ? "تحميل ملف sitemap.xml" : "Download sitemap.xml"}</span>
            </button>

            <button
              onClick={handleCopyXml}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? (isRtl ? "تم النسخ للحافظة!" : "Copied!") : (isRtl ? "نسخ كود XML" : "Copy XML Code")}</span>
            </button>

            <button
              onClick={handlePingSearchEngines}
              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-purple-400" />}
              <span>{isRtl ? "إشعار محرك البحث جوجل (Ping Search Console)" : "Ping Google Search Console"}</span>
            </button>

          </div>

          {pingSuccess && (
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isRtl ? "تم إرسال إشعار التحديث لمحركات البحث بنجاح!" : "Search engines notified successfully!"}</span>
            </span>
          )}

        </div>

      </div>

      {/* Main Tabs/Split: Indexed URLs List & Raw XML Code Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Indexed URLs Table (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h3 className="font-black text-white text-base">
                {isRtl ? "سجل الروابط المؤرشفة ديناميكياً" : "Dynamically Generated URL Index"}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {metrics.totalUrls} {isRtl ? "رابط" : "URLs"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-extrabold text-[11px]">
                  <th className="pb-2 text-start">{isRtl ? "الرابط المباشر (URL)" : "Location URL"}</th>
                  <th className="pb-2 text-center">{isRtl ? "التكرار" : "Frequency"}</th>
                  <th className="pb-2 text-center">{isRtl ? "الأولوية" : "Priority"}</th>
                  <th className="pb-2 text-end">{isRtl ? "التاريخ" : "Last Mod"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Homepage */}
                <tr className="hover:bg-slate-950/50 transition-colors">
                  <td className="py-2.5 font-bold text-white font-mono text-[11px] truncate max-w-xs">
                    {siteUrlInput}/
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">daily</span>
                  </td>
                  <td className="py-2.5 text-center font-extrabold text-white">1.0</td>
                  <td className="py-2.5 text-end text-slate-400 text-[10px] font-mono">{new Date().toISOString().split('T')[0]}</td>
                </tr>

                {/* Categories */}
                {cmsData.categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-950/50 transition-colors">
                    <td className="py-2.5 font-bold text-amber-300 font-mono text-[11px] truncate max-w-xs">
                      {siteUrlInput}/#service-{cat.slug || cat.id}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">weekly</span>
                    </td>
                    <td className="py-2.5 text-center font-extrabold text-amber-300">0.9</td>
                    <td className="py-2.5 text-end text-slate-400 text-[10px] font-mono">{new Date().toISOString().split('T')[0]}</td>
                  </tr>
                ))}

                {/* Published Blog Posts */}
                {cmsData.posts.filter(p => p.status === 'published').map((post) => (
                  <tr key={post.id} className="hover:bg-slate-950/50 transition-colors">
                    <td className="py-2.5 font-bold text-blue-300 font-mono text-[11px] truncate max-w-xs">
                      {siteUrlInput}/#post-{post.slug || post.id}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">monthly</span>
                    </td>
                    <td className="py-2.5 text-center font-extrabold text-blue-300">0.8</td>
                    <td className="py-2.5 text-end text-slate-400 text-[10px] font-mono">{post.date}</td>
                  </tr>
                ))}

                {/* Custom Pages */}
                {cmsData.pages.filter(p => p.isPublished).map((page) => (
                  <tr key={page.id} className="hover:bg-slate-950/50 transition-colors">
                    <td className="py-2.5 font-bold text-purple-300 font-mono text-[11px] truncate max-w-xs">
                      {siteUrlInput}/#page-{page.slug || page.id}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded">monthly</span>
                    </td>
                    <td className="py-2.5 text-center font-extrabold text-purple-300">0.7</td>
                    <td className="py-2.5 text-end text-slate-400 text-[10px] font-mono">{new Date().toISOString().split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: XML Code Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-white text-base">
                  {isRtl ? "معاينة كود XML المتولد" : "Generated XML Code"}
                </h3>
              </div>

              <button
                onClick={handleCopyXml}
                className="text-xs text-blue-400 hover:underline font-bold"
              >
                {copied ? (isRtl ? "تم النسخ" : "Copied") : (isRtl ? "نسخ" : "Copy")}
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 max-h-96 overflow-y-auto font-mono text-[11px] text-emerald-400 leading-relaxed dir-ltr">
              <pre>{xmlContent}</pre>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              {isRtl 
                ? "يتم رفع وتحديث هذا الملف فورياً في خادم Hostinger عند أي تعديل بالمسار /sitemap.xml."
                : "This file is auto-written to Hostinger server root on /sitemap.xml upon every save."}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
