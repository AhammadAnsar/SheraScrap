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
  Calculator,
  FileText
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface SearchAnalyticsManagerProps {
  lang: 'ar' | 'en';
}

export default function SearchAnalyticsManager({ lang }: SearchAnalyticsManagerProps) {
  const { cmsData, logSearchQuery, clearSearchLogs, setActiveAdminTab, addPost } = useCMS();
  const isRtl = lang === 'ar';

  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [testQueryInput, setTestQueryInput] = useState<string>('');
  const [testCategoryInput, setTestCategoryInput] = useState<string>('مكيفات مستعملة وسكراب');
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  const logs = cmsData.searchLogs || [];
  const categoryStats = cmsData.categoryStats || [];

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSource = filterSource === 'all' || log.source === filterSource;
    const matchesQuery = log.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.category && log.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSource && matchesQuery;
  });

  // Calculate totals
  const totalSearchCount = logs.reduce((sum, item) => sum + item.count, 0);
  const topLog = logs.length > 0 ? [...logs].sort((a, b) => b.count - a.count)[0] : null;

  // Categories sorted by total activity
  const topCategories = [...categoryStats].sort((a, b) => 
    ((b.searchesCount || 0) + (b.viewsCount || 0)) - ((a.searchesCount || 0) + (a.viewsCount || 0))
  );

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

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isRtl ? "تحليلات البحث واستراتيجية المحتوى الذكية" : "Search Query Analytics & Content Strategy"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {isRtl ? "لوحة تحليلات الكلمات الأكثر بحثاً وتفضيلات السكراب" : "Search Intent & Popular Category Analytics"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {isRtl 
              ? "تتبع ما يبحث عنه العملاء بالدمام تلقائياً، واستخدم التوصيات الذكية لإنشاء مقالات مخصصة وتحديث الأسعار."
              : "Track customer search terms in real-time to optimize blog articles, SEO strategy, and daily rates."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={() => {
                if (confirm(isRtl ? "هل أنت تأكد من مسح جميع سجلات البحث؟" : "Are you sure you want to clear search logs?")) {
                  clearSearchLogs();
                }
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isRtl ? "مسح السجلات" : "Clear Logs"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Searches */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-semibold">{isRtl ? "إجمالي عمليات البحث" : "Total Searches"}</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{totalSearchCount}</h3>
            <p className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{isRtl ? "تحديث تلقائي مجمع" : "Aggregated Live Search Logs"}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Top Search Term */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-semibold">{isRtl ? "العبارة الأكثر بحثاً" : "Top Search Query"}</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-black text-amber-300 truncate">
              {topLog ? topLog.query : (isRtl ? 'لا يوجد بيانات' : 'N/A')}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              {topLog ? `${topLog.count} ${isRtl ? 'مرة بحث' : 'Searches'}` : '0'}
            </p>
          </div>
        </div>

        {/* Card 3: Top Scrap Category */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-semibold">{isRtl ? "القسم الأكثر طلباً" : "Top Scrap Category"}</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-black text-blue-300 truncate">
              {topCategories.length > 0 
                ? (isRtl ? topCategories[0].categoryNameAr : topCategories[0].categoryNameEn)
                : (isRtl ? 'لا يوجد' : 'N/A')}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              {topCategories.length > 0 ? `${topCategories[0].viewsCount || 0} ${isRtl ? 'زيارة' : 'Views'}` : '0'}
            </p>
          </div>
        </div>

        {/* Card 4: Content Strategy Score */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-semibold">{isRtl ? "مؤشر فرصة SEO" : "SEO Opportunity Score"}</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-purple-300">94 / 100</h3>
            <p className="text-[11px] text-purple-400 font-bold mt-1">
              {isRtl ? "استهداف الكلمات العالية الطلب" : "High Query Matching"}
            </p>
          </div>
        </div>

      </div>

      {/* AI Strategy Recommendations Box */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
          <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" />
          <h3 className="font-extrabold text-white text-sm sm:text-base">
            {isRtl ? "توصيات استراتيجية المحتوى الموجهة بالبيانات (Content Insights)" : "Data-Driven Content Strategy Insights"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded">
                {isRtl ? "طلب مرتفع جدًا" : "High Demand"}
              </span>
              <span className="text-[10px] text-slate-500">142 {isRtl ? 'بحث' : 'Searches'}</span>
            </div>
            <h4 className="font-extrabold text-xs text-white">
              {isRtl ? "التركيز على مقالات سكراب المكيفات" : "Focus on Scrap AC Articles"}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isRtl 
                ? "تشير البيانات إلى أن 82% من عمليات البحث تطلب شراء مكيفات الشباك والسبليت بالدمام. نوصي بإنشاء مقال مخصص للفك المجاني."
                : "High query volume for used AC dismantling. Recommended to publish dedicated removal guides."}
            </p>
            <button
              onClick={() => handleCreatePostForQuery("شراء مكيفات شباك وسبليت بالدمام")}
              className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer mt-1"
            >
              <Plus className="w-3 h-3" />
              <span>{isRtl ? "إنشاء مقال لهذا الموضوع تلقائياً" : "Auto-Generate Draft Post"}</span>
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded">
                {isRtl ? "تحديث الأسعار" : "Rate Adjustment"}
              </span>
              <span className="text-[10px] text-slate-500">98 {isRtl ? 'بحث' : 'Searches'}</span>
            </div>
            <h4 className="font-extrabold text-xs text-white">
              {isRtl ? "تحديث سعر الكيلو لقسم النحاس" : "Update Copper Daily Rate"}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isRtl 
                ? "طلب مكثف على 'سعر كيلو النحاس الأحمر اليوم'. تأكد من مطابقة أسعار قسم النحاس مع أسعار البورصة الحالية."
                : "Frequent queries on copper price per kg. Ensure rates match current market rates."}
            </p>
            <button
              onClick={() => setActiveAdminTab('categories')}
              className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer mt-1"
            >
              <Layers className="w-3 h-3" />
              <span>{isRtl ? "الانتقال لمدير أسعار الأقسام" : "Go to Category Manager"}</span>
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-extrabold px-2 py-0.5 rounded">
                {isRtl ? "تفاعل مباشر" : "High Conversion"}
              </span>
              <span className="text-[10px] text-slate-500">76 {isRtl ? 'بحث' : 'Searches'}</span>
            </div>
            <h4 className="font-extrabold text-xs text-white">
              {isRtl ? "استهداف الأحياء السكنية (الفيصلية/الخبر)" : "Target Specific Districts"}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isRtl 
                ? "يبحث العملاء عن خدمات شراء السكراب بأسماء أحياء محددة كالفيصلية والخبر. تم تسليط الضوء عليها في الـ SEO Local."
                : "Local queries targeting specific neighborhood names in Dammam & Khobar."}
            </p>
            <button
              onClick={() => setActiveAdminTab('settings')}
              className="text-[11px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer mt-1"
            >
              <FileText className="w-3 h-3" />
              <span>{isRtl ? "تعديل إعدادات SEO المحتويات" : "Manage Local SEO Settings"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Split: Query Logs Table (Left) & Category Popularity Stats (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Top Search Query Logs Table (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              <h3 className="font-black text-white text-base">
                {isRtl ? "سجل الكلمات والعبارات الأكثر بحثاً" : "Recorded Search Queries"}
              </h3>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="all">{isRtl ? "جميع المصادر" : "All Sources"}</option>
                <option value="header_search">{isRtl ? "مربع البحث" : "Header Search"}</option>
                <option value="estimator">{isRtl ? "حاسبة التقييم" : "Estimator"}</option>
                <option value="blog_search">{isRtl ? "بحث المقالات" : "Blog Search"}</option>
                <option value="category_filter">{isRtl ? "تصفية الأقسام" : "Category Filter"}</option>
              </select>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isRtl ? "فلترة..." : "Filter..."}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none w-28"
              />
            </div>
          </div>

          {/* Search Table */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs space-y-2">
              <p>{isRtl ? "لا توجد نتائج مطابقة لعمليات البحث الحالية" : "No matching search logs found"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-extrabold text-[11px]">
                    <th className="pb-2 text-start">{isRtl ? "عبارة البحث" : "Search Term"}</th>
                    <th className="pb-2 text-start">{isRtl ? "القسم المرتبط" : "Scrap Category"}</th>
                    <th className="pb-2 text-center">{isRtl ? "عدد التكرار" : "Volume"}</th>
                    <th className="pb-2 text-center">{isRtl ? "المصدر" : "Source"}</th>
                    <th className="pb-2 text-end">{isRtl ? "إجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.map((log) => {
                    const maxCount = Math.max(...logs.map(l => l.count), 1);
                    const percentage = Math.round((log.count / maxCount) * 100);

                    return (
                      <tr key={log.id} className="hover:bg-slate-950/50 transition-colors">
                        <td className="py-3 font-extrabold text-white">
                          <div className="flex flex-col">
                            <span>{log.query}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{log.lastSearched}</span>
                          </div>
                        </td>

                        <td className="py-3">
                          <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded font-bold">
                            {log.category || (isRtl ? 'عام' : 'General')}
                          </span>
                        </td>

                        <td className="py-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-extrabold text-white text-xs">{log.count}</span>
                            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3 text-center">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {log.source === 'estimator' ? (isRtl ? 'المقيّم' : 'Estimator') :
                             log.source === 'blog_search' ? (isRtl ? 'المقالات' : 'Blog') :
                             log.source === 'category_filter' ? (isRtl ? 'الأقسام' : 'Category') :
                             (isRtl ? 'البحث' : 'Search')}
                          </span>
                        </td>

                        <td className="py-3 text-end">
                          <button
                            onClick={() => handleCreatePostForQuery(log.query)}
                            title={isRtl ? "كتابة مقال لهذا الموضوع" : "Draft article for this query"}
                            className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer"
                          >
                            {isRtl ? "+ مقال" : "+ Draft"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Test Simulator Box */}
          <div className="border-t border-slate-800 pt-4">
            <form onSubmit={handleSimulateSearch} className="bg-slate-950 p-3.5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRtl ? "مُحاكي تسجيل البحث المباشر (تجديد البيانات)" : "Live Search Query Logger Simulator"}</span>
                </span>
                {testSuccess && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                    {isRtl ? "تمت إضافة كلمة البحث للتحليلات!" : "Query Logged!"}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={testQueryInput}
                  onChange={(e) => setTestQueryInput(e.target.value)}
                  placeholder={isRtl ? "اكتب كلمة تجريبية (مثال: سكراب نحاس بالخبر)..." : "Enter test query..."}
                  className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />

                <select
                  value={testCategoryInput}
                  onChange={(e) => setTestCategoryInput(e.target.value)}
                  className="w-full sm:w-auto bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  {cmsData.categories.map((cat) => (
                    <option key={cat.id} value={cat.nameAr}>
                      {isRtl ? cat.nameAr : cat.nameEn}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shrink-0"
                >
                  {isRtl ? "محاكاة بحث" : "Log Search"}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Popular Scrap Categories Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h3 className="font-black text-white text-base">
                {isRtl ? "تصنيف الأقسام الأكثر شعبية واهتماماً" : "Popular Scrap Category Stats"}
              </h3>
            </div>

            <button
              onClick={() => setActiveAdminTab('categories')}
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              {isRtl ? "إدارة الأقسام ←" : "Manage →"}
            </button>
          </div>

          <div className="space-y-3">
            {topCategories.map((stat, idx) => {
              const categoryObj = cmsData.categories.find(c => c.id === stat.categoryId);
              const maxViews = Math.max(...topCategories.map(s => s.viewsCount || 1), 1);
              const viewPercentage = Math.round(((stat.viewsCount || 0) / maxViews) * 100);

              return (
                <div key={stat.categoryId || idx} className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-extrabold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-white text-xs">
                        {isRtl ? stat.categoryNameAr : stat.categoryNameEn}
                      </h4>
                    </div>

                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2 py-0.5 rounded">
                      {categoryObj?.rateEstimateAr || (isRtl ? 'تسعير مباشر' : 'Live Quote')}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" 
                      style={{ width: `${Math.max(viewPercentage, 10)}%` }}
                    />
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-blue-400" />
                      <span>{stat.viewsCount || 0} {isRtl ? 'زيارة' : 'Views'}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Search className="w-3 h-3 text-amber-400" />
                      <span>{stat.searchesCount || 0} {isRtl ? 'بحث' : 'Searches'}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>{stat.inquiriesCount || 0} {isRtl ? 'طلب' : 'Leads'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
