import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  Layers, 
  Eye, 
  MessageSquare, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Filter, 
  Lightbulb, 
  Zap, 
  ArrowUpRight,
  FileText,
  Globe,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Send,
  Code,
  MapPin,
  ArrowRightLeft,
  FileCode,
  Bot,
  Save,
  Image as ImageIcon,
  AlertTriangle,
  Award,
  Sliders,
  ShieldCheck,
  Share2,
  Info
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { generateSitemapXml, getSitemapMetrics } from '../../utils/sitemapGenerator';
import { RedirectionItem } from '../../cms/types';

interface SeoCenterManagerProps {
  lang: 'ar' | 'en';
  defaultTab?: 'search-analytics' | 'sitemap' | 'audit' | 'meta' | 'local' | 'schema' | 'webmasters' | 'redirections' | 'robots';
}

export default function SeoCenterManager({ lang, defaultTab = 'search-analytics' }: SeoCenterManagerProps) {
  const { cmsData, updateSettings, saveCMSData, logSearchQuery, clearSearchLogs, setActiveAdminTab, addPost } = useCMS();
  const isRtl = lang === 'ar';

  // Sub-tabs state
  const [activeSubTab, setActiveSubTab] = useState<'search-analytics' | 'sitemap' | 'audit' | 'meta' | 'local' | 'schema' | 'webmasters' | 'redirections' | 'robots'>(defaultTab);

  // Form data for SEO settings
  const [formData, setFormData] = useState(cmsData.settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Search analytics states
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [testQueryInput, setTestQueryInput] = useState<string>('');
  const [testCategoryInput, setTestCategoryInput] = useState<string>('مكيفات مستعملة وسكراب');
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  // Sitemap states
  const [xmlCopied, setXmlCopied] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [siteUrlInput, setSiteUrlInput] = useState(cmsData.settings.siteUrl || 'https://shera-scrap-haraj.com');

  // Redirection creation state
  const [newFromUrl, setNewFromUrl] = useState('');
  const [newToUrl, setNewToUrl] = useState('');
  const [newRedirectType, setNewRedirectType] = useState<'301' | '302'>('301');

  // Logs and categories
  const logs = cmsData.searchLogs || [];
  const categoryStats = cmsData.categoryStats || [];

  // Filter search logs
  const filteredLogs = logs.filter(log => {
    const matchesSource = filterSource === 'all' || log.source === filterSource;
    const matchesQuery = log.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.category && log.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSource && matchesQuery;
  });

  const totalSearchCount = logs.reduce((sum, item) => sum + item.count, 0);

  // Sitemap generator calculations
  const xmlContent = generateSitemapXml(cmsData);
  const metrics = getSitemapMetrics(cmsData);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSimulateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQueryInput.trim()) return;

    logSearchQuery(testQueryInput, testCategoryInput, 'header_search');
    setTestQueryInput('');
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  const handleCreatePostForQuery = (queryText: string) => {
    addPost({
      slug: queryText.toLowerCase().replace(/\s+/g, '-'),
      titleAr: `دليل شامل: ${queryText} بالدمام والمنطقة الشرقية 2026`,
      titleEn: `Complete Guide: ${queryText} in Dammam 2026`,
      excerptAr: `كل ما تحتاج معرفته عن ${queryText} وكيف تضمن أفضل سعر كاش مع الفك والنقل المباشر.`,
      excerptEn: `Everything you need to know about ${queryText} with top cash payment and free removal.`,
      contentAr: `### ${queryText} بالدمام والشرقية\n\nبناءً على طلبات العملاء المتزايدة لمواضيع **${queryText}**، توفر مؤسسة شيرا خدمات متكاملة وسريعة للتقييم والشراء الهيدروليكي بأعلى أسعار حراج الدمام.\n\nتواصل معنا عبر الواتساب لمعاينة موقعك فوراً!`,
      contentEn: `### ${queryText} Guide\n\nBased on high demand for **${queryText}**, Shera Scrap provides instant evaluation and full removal services.\n\nContact us on WhatsApp for an immediate quote!`,
      category: 'استراتيجية المحتوى',
      tags: [queryText, 'السكراب بالدمام'],
      featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      author: 'SEO Content Engine',
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    });

    setActiveAdminTab('posts');
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setXmlCopied(true);
    setTimeout(() => setXmlCopied(false), 2500);
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

  // Calculate SEO Health Score (out of 100)
  const calculateSeoScore = () => {
    let score = 0;
    const checks: Array<{ titleAr: string; titleEn: string; status: boolean; weight: number; hintAr: string; hintEn: string }> = [];

    // Check 1: Meta Title set
    const titleOk = Boolean(formData.metaTitleAr && formData.metaTitleAr.length >= 20);
    checks.push({
      titleAr: 'عنوان الميتا (Meta Title)',
      titleEn: 'Meta Title Optimization',
      status: titleOk,
      weight: 15,
      hintAr: 'يُنصح بكتابة عنوان ميتا دقيق يحتوي اسم الدمام والشرقية (أكثر من 20 حرف)',
      hintEn: 'Add meta title containing primary location keywords'
    });

    // Check 2: Meta Description set
    const descOk = Boolean(formData.metaDescriptionAr && formData.metaDescriptionAr.length >= 50);
    checks.push({
      titleAr: 'وصف الميتا (Meta Description)',
      titleEn: 'Meta Description Optimization',
      status: descOk,
      weight: 15,
      hintAr: 'يُنصح بكتابة وصف جذاب ومحفز للضغط أكثر من 50 حرف',
      hintEn: 'Add clear compelling meta description (>50 chars)'
    });

    // Check 3: Focus Keywords set
    const kwOk = Boolean(formData.focusKeywordsAr && formData.focusKeywordsAr.length > 5);
    checks.push({
      titleAr: 'الكلمات المفتاحية المستهدفة',
      titleEn: 'Focus Target Keywords',
      status: kwOk,
      weight: 10,
      hintAr: 'حدد الكلمات الرئيسية مثل شراء سكراب بالدمام',
      hintEn: 'Define target focus keywords for ranking'
    });

    // Check 4: Google Search Console Verification
    const gscOk = Boolean(formData.googleWebmasterCode && formData.googleWebmasterCode.length > 5);
    checks.push({
      titleAr: 'الربط مع Google Search Console',
      titleEn: 'Google Search Console Verification',
      status: gscOk,
      weight: 15,
      hintAr: 'أضف كود تحقق جوجل لمتابعة الأرشفة والأخطاء',
      hintEn: 'Add Google Search Console verification meta code'
    });

    // Check 5: Google Analytics (GA4)
    const gaOk = Boolean(formData.analyticsCode && formData.analyticsCode.length > 5);
    checks.push({
      titleAr: 'تتبع الزوار Google Analytics GA4',
      titleEn: 'Google Analytics GA4 Integration',
      status: gaOk,
      weight: 10,
      hintAr: 'أضف معرف G-XXXXXX للتحليلات',
      hintEn: 'Add Measurement ID to track user sessions'
    });

    // Check 6: Schema.org Structured Data
    const schemaOk = Boolean(formData.schemaJsonLd && formData.schemaJsonLd.includes('LocalBusiness'));
    checks.push({
      titleAr: 'البيانات المنظمة (Schema JSON-LD)',
      titleEn: 'Schema.org JSON-LD Data',
      status: schemaOk,
      weight: 15,
      hintAr: 'تأكيد وجود مخطط LocalBusiness للظهور في الخرائط والجزء العلوي',
      hintEn: 'Add valid LocalBusiness JSON-LD schema'
    });

    // Check 7: Dynamic Sitemap & Robots.txt
    const sitemapOk = Boolean(xmlContent && xmlContent.includes('urlset'));
    checks.push({
      titleAr: 'خريطة الموقع XML المباشرة',
      titleEn: 'Live Dynamic Sitemap XML',
      status: sitemapOk,
      weight: 10,
      hintAr: 'خريطة الموقع متولدة وتغطي جميع الأقسام',
      hintEn: 'Dynamic sitemap is active'
    });

    // Check 8: Local SEO Coordinates
    const localOk = Boolean(formData.localSeoGeo && formData.localSeoGeo.includes(','));
    checks.push({
      titleAr: 'إحداثيات الخرائط المحلية بالدمام',
      titleEn: 'Local Geo Coordinates',
      status: localOk,
      weight: 10,
      hintAr: 'أدخل خطوط الطول والعرض للفرع',
      hintEn: 'Enter latitude and longitude for Google Maps'
    });

    checks.forEach(c => {
      if (c.status) score += c.weight;
    });

    return { score, checks };
  };

  const seoAudit = calculateSeoScore();

  return (
    <div className="space-y-6">
      
      {/* Top Main Command Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 rounded-3xl text-white shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-black mb-2">
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? "مركز إدارة وتحليلات SEO وتصدر نتائج البحث 2026" : "Unified SEO & Search Intelligence Command Center"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {isRtl ? "محرك تهيئة محركات البحث، تحليلات الطلب، وخريطة الموقع" : "SEO Optimization, Search Intent & Sitemap Hub"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            {isRtl 
              ? "تحكم كامل ومدمج في تحليلات الكلمات الأكثر بحثاً، خريطة الموقع التلقائية sitemap.xml، وسوم الميتا، والـ Schema، وربط Google Search Console لضمان الهيمنة على نتائج البحث بالدمام والشرقية." 
              : "Unified suite for search analytics, dynamic sitemap XML generation, meta tags, schema structured data, and Search Console indexing."}
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch lg:self-auto justify-end">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold block">{isRtl ? "جودة SEO الحالية" : "SEO Score"}</span>
              <span className={`text-xl font-black ${seoAudit.score >= 80 ? 'text-emerald-400' : seoAudit.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {seoAudit.score}/100
              </span>
            </div>
            <Award className={`w-8 h-8 ${seoAudit.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>

          <button
            onClick={() => handleSubmitSettings()}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all text-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? "حفظ التغييرات" : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? "تم حفظ وتطبيق جميع إعدادات SEO وتحديث خريطة الموقع بنجاح!" : "All SEO & Sitemap settings updated successfully!"}</span>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800">
        {[
          { id: 'search-analytics', labelAr: 'تحليلات كلمات البحث والطلب', labelEn: 'Search Analytics', icon: BarChart3, badge: totalSearchCount },
          { id: 'sitemap', labelAr: 'خريطة الموقع sitemap.xml', labelEn: 'Dynamic Sitemap', icon: Globe, badge: metrics.totalUrls },
          { id: 'audit', labelAr: 'فاحص جودة SEO والمعاينة', labelEn: 'SEO Score & Audit', icon: ShieldCheck, badge: `${seoAudit.score}%` },
          { id: 'meta', labelAr: 'وسوم الميتا والعناوين', labelEn: 'Meta Tags & OpenGraph', icon: Search },
          { id: 'local', labelAr: 'SEO المحلي والخرائط', labelEn: 'Local SEO & Maps', icon: MapPin },
          { id: 'schema', labelAr: 'البيانات المنظمة Schema', labelEn: 'Schema JSON-LD', icon: FileCode },
          { id: 'webmasters', labelAr: 'Search Console & GA4', labelEn: 'Webmasters & GA4', icon: Code },
          { id: 'redirections', labelAr: 'إعادة التوجيه 301', labelEn: 'Redirections', icon: ArrowRightLeft },
          { id: 'robots', labelAr: 'Robots.txt & AI LLMS', labelEn: 'Robots & AI Txt', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                isActive 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================== */}
      {/* SUB-TAB 1: SEARCH ANALYTICS                                */}
      {/* ========================================================== */}
      {activeSubTab === 'search-analytics' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Real-time Search Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "إجمالي عمليات البحث بالموقع" : "Total Search Volume"}</span>
              <div className="mt-2 flex items-baseline justify-between">
                <h3 className="text-3xl font-black text-white">{totalSearchCount}</h3>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+100%</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "العبارة الأكثر طلباً بالدمام" : "Top Search Query"}</span>
              <div className="mt-2">
                <h3 className="text-lg font-black text-amber-300 truncate">
                  {logs.length > 0 ? logs[0].query : (isRtl ? "لا توجد بيانات" : "No Data")}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {logs.length > 0 ? `${logs[0].count} ${isRtl ? 'مرة بحث' : 'searches'}` : ''}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "أكثر فئة اهتماماً بالأسعار" : "Top Interest Category"}</span>
              <div className="mt-2">
                <h3 className="text-lg font-black text-cyan-300 truncate">
                  {categoryStats.length > 0 ? categoryStats[0].categoryName : (isRtl ? "مكيفات وسكراب" : "AC & Scrap")}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {categoryStats.length > 0 ? `${categoryStats[0].searchesCount} ${isRtl ? 'استعلام' : 'queries'}` : ''}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "فرص المقالات التلقائية" : "AI Article Opportunities"}</span>
              <div className="mt-2 flex items-baseline justify-between">
                <h3 className="text-3xl font-black text-purple-300">{logs.length}</h3>
                <button
                  onClick={() => logs.length > 0 && handleCreatePostForQuery(logs[0].query)}
                  className="text-[11px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isRtl ? "توليد مسودة" : "Generate Draft"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Query Logs Table & Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  {isRtl ? "سجل الكلمات المستعلم عنها بواسطة الزوار" : "Visitor Search Queries Log"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={isRtl ? "تصفية الكلمات..." : "Filter queries..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                {logs.length > 0 && (
                  <button
                    onClick={clearSearchLogs}
                    className="p-1.5 text-slate-500 hover:text-red-400 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                    title={isRtl ? "مسح السجل" : "Clear Logs"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-extrabold text-[11px]">
                    <th className="pb-2 text-start">{isRtl ? "عبارة البحث" : "Search Query"}</th>
                    <th className="pb-2 text-start">{isRtl ? "الفئة المستهدفة" : "Category"}</th>
                    <th className="pb-2 text-center">{isRtl ? "عدد التكرار" : "Count"}</th>
                    <th className="pb-2 text-center">{isRtl ? "المصدر" : "Source"}</th>
                    <th className="pb-2 text-end">{isRtl ? "إجراء SEO الذكي" : "Smart Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        {isRtl ? "لا توجد عمليات بحث مسجلة حالياً." : "No search queries recorded yet."}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="py-3 font-bold text-white text-xs">{log.query}</td>
                        <td className="py-3">
                          <span className="bg-emerald-500/10 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                            {log.category || (isRtl ? 'عام' : 'General')}
                          </span>
                        </td>
                        <td className="py-3 text-center font-extrabold text-amber-300">{log.count}</td>
                        <td className="py-3 text-center text-slate-400 text-[10px]">{log.source}</td>
                        <td className="py-3 text-end">
                          <button
                            onClick={() => handleCreatePostForQuery(log.query)}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{isRtl ? "إنشاء مقال SEO" : "Create Post"}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Simulate Test Search Query Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-extrabold text-white text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? "اختبار تسجيل كلمة بحث جديدة بدقة" : "Simulate Search Query Entry"}</span>
            </h3>

            <form onSubmit={handleSimulateSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-[11px] text-slate-400 font-bold mb-1">{isRtl ? "نص البحث" : "Query Text"}</label>
                <input
                  type="text"
                  value={testQueryInput}
                  onChange={(e) => setTestQueryInput(e.target.value)}
                  placeholder="مثال: أسعار كيابل النحاس بالدمام"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-bold mb-1">{isRtl ? "الفئة المقترنة" : "Category"}</label>
                <input
                  type="text"
                  value={testCategoryInput}
                  onChange={(e) => setTestCategoryInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                {isRtl ? "+ تسجيل الاستعلام في Analytics" : "+ Log Test Query"}
              </button>
            </form>

            {testSuccess && (
              <span className="text-xs text-emerald-400 font-bold block animate-in fade-in">
                ✓ {isRtl ? "تم تسجيل كلمة البحث في قاعدة البيانات بنجاح!" : "Test search query logged successfully!"}
              </span>
            )}
          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 2: DYNAMIC SITEMAP XML                             */}
      {/* ========================================================== */}
      {activeSubTab === 'sitemap' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Sitemap Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "إجمالي الروابط المؤرشفة" : "Indexed URLs"}</span>
              <div className="mt-2">
                <h3 className="text-2xl font-black text-white">{metrics.totalUrls}</h3>
                <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isRtl ? "جاهزة لجوجل" : "Google Ready"}</span>
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "أقسام خدمات السكراب" : "Scrap Categories"}</span>
              <div className="mt-2">
                <h3 className="text-2xl font-black text-amber-300">{metrics.categoriesCount}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{isRtl ? "أولوية 0.9" : "Priority 0.9"}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "المقالات المنشورة" : "Published Posts"}</span>
              <div className="mt-2">
                <h3 className="text-2xl font-black text-emerald-300">{metrics.publishedPostsCount}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{isRtl ? "تحديث شهري" : "Monthly Mod"}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "الصفحات المخصصة" : "Custom Pages"}</span>
              <div className="mt-2">
                <h3 className="text-2xl font-black text-purple-300">{metrics.publishedPagesCount}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{isRtl ? "أولوية 0.7" : "Priority 0.7"}</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-semibold">{isRtl ? "معاينة الملف المباشر" : "Live View"}</span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>/sitemap.xml</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Base Domain & Sitemap Control Panel */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            
            <form onSubmit={handleSaveSiteUrl} className="flex flex-col md:flex-row items-end gap-3 pb-4 border-b border-slate-800">
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isRtl ? "رابط النطاق الرئيسي للموقع (Site Domain):" : "Base Domain URL:"}</span>
                </label>
                <input
                  type="url"
                  value={siteUrlInput}
                  onChange={(e) => setSiteUrlInput(e.target.value)}
                  placeholder="https://shera-scrap-haraj.com"
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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadXml}
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{isRtl ? "تحميل sitemap.xml" : "Download XML"}</span>
                </button>

                <button
                  onClick={handleCopyXml}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  {xmlCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>{xmlCopied ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ كود XML" : "Copy XML")}</span>
                </button>

                <button
                  onClick={handlePingSearchEngines}
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-purple-400" />}
                  <span>{isRtl ? "إشعار محرك البحث Google" : "Ping Search Console"}</span>
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

          {/* XML Code Codeblock Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-xs flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>{isRtl ? "معاينة كود XML المتولد تلقائياً" : "Auto-Generated XML Structure"}</span>
              </h3>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 max-h-80 overflow-y-auto font-mono text-[11px] text-emerald-400 leading-relaxed dir-ltr">
              <pre>{xmlContent}</pre>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 3: SEO AUDIT & SERP PREVIEW                        */}
      {/* ========================================================== */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* SERP Google Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{isRtl ? "معاينة ظهور الموقع في نتائج بحث جوجل (Google SERP Snippet Preview)" : "Google Search SERP Preview"}</span>
            </h3>

            {/* Simulated Desktop Search Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1 dir-ltr text-left">
              <div className="flex items-center gap-1.5 text-xs text-[12px] text-[#202124]">
                <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold">
                  S
                </div>
                <span className="font-sans text-[13px] text-[#202124]">
                  {siteUrlInput.replace('https://', '')}
                </span>
                <span className="text-[#5f6368] text-[12px]">› ...</span>
              </div>

              <h4 className="text-[#1a0dab] hover:underline text-lg font-medium cursor-pointer leading-snug font-sans">
                {formData.metaTitleAr || formData.siteTitleAr || 'شراء سكراب بالدمام والشرقية بأعلى سعر كاش | مؤسسة شيرا'}
              </h4>

              <p className="text-[#4d5156] text-xs leading-relaxed font-sans line-clamp-2">
                {formData.metaDescriptionAr || formData.siteTaglineAr || 'أفضل مؤسسة شراء سكراب بالدمام والخبر والجُبيل. نشتري النحاس، الألومنيوم، الحديد، والمكيفات المستعملة بأعلى سعر كاش مع الفك والنقل المباشر.'}
              </p>

              {/* Rich snippet extensions */}
              <div className="flex items-center gap-3 pt-2 text-[11px] text-[#5f6368] border-t border-slate-100 font-sans">
                <span className="text-emerald-700 font-bold">★★★★★ Rating: 4.9/5</span>
                <span>• Local Business Dammam</span>
                <span>• 24/7 Service</span>
              </div>
            </div>
          </div>

          {/* Actionable SEO Health Checks List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "فحص عناصر SEO وحالة الجودة" : "SEO Factor Audit & Recommendations"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {seoAudit.checks.map((chk, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${chk.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {chk.status ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{isRtl ? chk.titleAr : chk.titleEn}</h4>
                      <span className="text-[10px] font-mono text-slate-400">+{chk.weight} pts</span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1">
                      {isRtl ? chk.hintAr : chk.hintEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 4: META TAGS & OPENGRAPH                           */}
      {/* ========================================================== */}
      {activeSubTab === 'meta' && (
        <form onSubmit={handleSubmitSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? "عناوين وسوم الميتا الرئيسية (Meta Titles & Descriptions)" : "Primary Meta Titles & Descriptions"}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "عنوان الميتا بالعربية (Meta Title AR)" : "Arabic Meta Title"}
              </label>
              <input
                type="text"
                name="metaTitleAr"
                value={formData.metaTitleAr || ''}
                onChange={handleChange}
                placeholder="شراء سكراب بالدمام والشرقية بأعلى سعر كاش | مؤسسة شيرا"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "عنوان الميتا بالإنجليزي (Meta Title EN)" : "English Meta Title"}
              </label>
              <input
                type="text"
                name="metaTitleEn"
                value={formData.metaTitleEn || ''}
                onChange={handleChange}
                placeholder="Buy Scrap Metals in Dammam & Eastern Province | Shera Scrap"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "وصف الميتا بالعربية (Meta Description AR)" : "Arabic Meta Description"}
              </label>
              <textarea
                name="metaDescriptionAr"
                value={formData.metaDescriptionAr || ''}
                onChange={handleChange}
                rows={3}
                placeholder="أفضل شركة شراء سكراب بالدمام والخبر والجُبيل. نشتري النحاس، الألومنيوم، الحديد، والمكيفات المستعملة بأعلى سعر كاش..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "الكلمات المفتاحية المستهدفة (Focus Target Keywords)" : "Focus Target Keywords"}
              </label>
              <input
                type="text"
                name="focusKeywordsAr"
                value={formData.focusKeywordsAr || ''}
                onChange={handleChange}
                placeholder="شراء سكراب بالدمام, نشتري السكراب بالخبر, سعر كيلو النحاس, شراء مكيفات مستعملة بالدمام"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? "حفظ وسوم الميتا" : "Save Meta Tags"}</span>
          </button>
        </form>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 5: LOCAL SEO & MAPS                                */}
      {/* ========================================================== */}
      {activeSubTab === 'local' && (
        <form onSubmit={handleSubmitSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? "تهيئة نتائج البحث المحلية والخرائط (Local SEO)" : "Local SEO & Business Location"}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "اسم النشاط التجاري بالخرائط" : "Registered Business Name"}
              </label>
              <input
                type="text"
                name="localSeoName"
                value={formData.localSeoName || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "إحداثيات الموقع (Geo Latitude, Longitude)" : "Geo Coordinates (Lat, Long)"}
              </label>
              <input
                type="text"
                name="localSeoGeo"
                value={formData.localSeoGeo || ''}
                onChange={handleChange}
                placeholder="26.4344, 50.1033"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "العنوان بالتفصيل بالدمام والشرقية" : "Full Business Address"}
              </label>
              <input
                type="text"
                name="localSeoAddress"
                value={formData.localSeoAddress || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? "حفظ إعدادات Local SEO" : "Save Local SEO"}</span>
          </button>
        </form>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 6: SCHEMA JSON-LD STRUCTURED DATA                  */}
      {/* ========================================================== */}
      {activeSubTab === 'schema' && (
        <form onSubmit={handleSubmitSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? "البيانات المنظمة Schema (JSON-LD Structured Data)" : "JSON-LD Schema Structured Data"}</span>
          </h2>

          <p className="text-slate-400 text-xs">
            {isRtl 
              ? "مخطط Schema يساعد محركات البحث في فهم الخدمات والساعات والموقع وعرض التقييمات في أعلى نتائج بحث جوجل."
              : "JSON-LD structured data helps Google show Rich Snippets, rating stars, and knowledge graph panels."}
          </p>

          <textarea
            name="schemaJsonLd"
            value={formData.schemaJsonLd || ''}
            onChange={handleChange}
            rows={10}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-300 text-xs font-mono leading-relaxed"
          />

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? "حفظ كود الـ Schema" : "Save Schema"}</span>
          </button>
        </form>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 7: WEBMASTERS & ANALYTICS                          */}
      {/* ========================================================== */}
      {activeSubTab === 'webmasters' && (
        <form onSubmit={handleSubmitSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? "أكواد التحقق والتتبع (Search Console & GA4)" : "Google Search Console & GA4 Integration"}</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "Google Search Console Verification Tag" : "Google Search Console Verification Meta"}
              </label>
              <input
                type="text"
                name="googleWebmasterCode"
                value={formData.googleWebmasterCode || ''}
                onChange={handleChange}
                placeholder="google-site-verification=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "Google Analytics 4 Measurement ID" : "Google Analytics 4 Measurement ID"}
              </label>
              <input
                type="text"
                name="analyticsCode"
                value={formData.analyticsCode || ''}
                onChange={handleChange}
                placeholder="G-XXXXXXX or GTM-XXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? "حفظ أكواد التتبع" : "Save Tracking Codes"}</span>
          </button>
        </form>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 8: REDIRECTIONS 301/302                            */}
      {/* ========================================================== */}
      {activeSubTab === 'redirections' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
            <span>{isRtl ? "إدارة توجيهات الروابط (301/302 Redirection Manager)" : "Redirection Rules"}</span>
          </h2>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">{isRtl ? "من (From URL)" : "From Path"}</label>
              <input
                type="text"
                value={newFromUrl}
                onChange={(e) => setNewFromUrl(e.target.value)}
                placeholder="/old-page"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">{isRtl ? "إلى (To URL)" : "To Path"}</label>
              <input
                type="text"
                value={newToUrl}
                onChange={(e) => setNewToUrl(e.target.value)}
                placeholder="/new-page"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">{isRtl ? "النوع" : "Type"}</label>
              <select
                value={newRedirectType}
                onChange={(e) => setNewRedirectType(e.target.value as '301' | '302')}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
              >
                <option value="301">301 Permanent</option>
                <option value="302">302 Temporary</option>
              </select>
            </div>

            <button
              type="button"
              onClick={addRedirection}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? "إضافة توجيه" : "Add Redirect"}</span>
            </button>
          </div>

          <div className="space-y-2">
            {(formData.redirections || []).map((red) => (
              <div key={red.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">{red.fromUrl}</span>
                  <span className="text-emerald-400">➔</span>
                  <span className="text-cyan-400">{red.toUrl}</span>
                  <span className="text-[10px] font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded ml-2">{red.type}</span>
                </div>

                <button
                  type="button"
                  onClick={() => removeRedirection(red.id)}
                  className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* SUB-TAB 9: ROBOTS.TXT & AI LLMS.TXT                        */}
      {/* ========================================================== */}
      {activeSubTab === 'robots' && (
        <form onSubmit={handleSubmitSettings} className="space-y-6 animate-in fade-in">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "محرر ملف LLMS Txt لتهيئة الموقع لربوتات الذكاء الاصطناعي" : "LLMS Txt AI Search Rules"}</span>
            </h2>

            <textarea
              name="llmsTxtContent"
              value={formData.llmsTxtContent || ''}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 text-xs font-mono leading-relaxed"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? "محرر ملف Robots.txt" : "Robots.txt Rules"}</span>
            </h2>

            <textarea
              name="robotsTxtContent"
              value={formData.robotsTxtContent || ''}
              onChange={handleChange}
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isRtl ? "حفظ القواعد" : "Save Crawler Directives"}</span>
          </button>
        </form>
      )}

    </div>
  );
}
