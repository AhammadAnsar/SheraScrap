import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  MessageSquare, 
  Sliders, 
  Users, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  Wrench,
  Palette,
  Search,
  BarChart3,
  Globe
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface DashboardOverviewProps {
  lang: 'ar' | 'en';
}

export default function DashboardOverview({ lang }: DashboardOverviewProps) {
  const { cmsData, setActiveAdminTab, setIsAdminOpen, addPost } = useCMS();
  const isRtl = lang === 'ar';

  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftSuccess, setDraftSuccess] = useState(false);

  const totalPosts = cmsData.posts.length;
  const totalInquiries = cmsData.inquiries.length;
  const newInquiries = cmsData.inquiries.filter(i => i.status === 'new').length;
  const totalCategories = cmsData.categories.length;
  const totalSlides = cmsData.slides.length;
  const totalServices = cmsData.services.length;

  const handleSaveQuickDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle) return;

    addPost({
      slug: draftTitle.toLowerCase().replace(/\s+/g, '-'),
      titleAr: draftTitle,
      titleEn: draftTitle,
      excerptAr: draftContent.slice(0, 80) || 'مسودة جديدة',
      excerptEn: draftContent.slice(0, 80) || 'New Quick Draft',
      contentAr: draftContent,
      contentEn: draftContent,
      category: 'عام',
      tags: ['مسودة'],
      featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    });

    setDraftTitle('');
    setDraftContent('');
    setDraftSuccess(true);
    setTimeout(() => setDraftSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isRtl ? "مرحباً بك في لوحة تحكم SoftDows CMS" : "Welcome to SoftDows CMS"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {isRtl 
              ? "إدارة موقع شراء السكراب والخدمات اللوجستية بالدمام" 
              : "Manage Dammam Scrap Portal Content & Settings"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {isRtl 
              ? "تعديل السلايدر، المقالات، الأسعار اليومية، الطلبات، والضبط الكامل بمرونة تامة." 
              : "Update sliders, blog posts, daily scrap rates, customer leads, and full customization."}
          </p>
        </div>

        <button
          onClick={() => setIsAdminOpen(false)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl transition-all text-xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{isRtl ? "معاينة الموقع الحية" : "Live Site Preview"}</span>
        </button>
      </div>

      {/* WordPress Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          {
            title: isRtl ? "طلبات الشراء والعملاء" : "Customer Leads",
            count: totalInquiries,
            badge: newInquiries > 0 ? `${newInquiries} ${isRtl ? 'جديد' : 'New'}` : null,
            icon: MessageSquare,
            color: "border-teal-500/30 bg-teal-500/10 text-teal-400",
            tab: "inquiries"
          },
          {
            title: isRtl ? "كلمات البحث والطلب" : "Search Queries",
            count: (cmsData.searchLogs || []).reduce((sum, item) => sum + item.count, 0),
            badge: isRtl ? "تحليلات SEO" : "SEO Insights",
            icon: Search,
            color: "border-amber-500/30 bg-amber-500/10 text-amber-400",
            tab: "search-analytics"
          },
          {
            title: isRtl ? "روابط خريطة الموقع" : "Sitemap URLs",
            count: 6 + (cmsData.categories || []).length + cmsData.posts.filter(p => p.status === 'published').length + (cmsData.pages || []).filter(p => p.isPublished).length,
            badge: isRtl ? "تلقائي XML" : "Auto XML",
            icon: Globe,
            color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
            tab: "sitemap"
          },
          {
            title: isRtl ? "شرائح السلايدر" : "Hero Slides",
            count: totalSlides,
            badge: `${totalSlides} ${isRtl ? 'مستعرض' : 'Active'}`,
            icon: Sliders,
            color: "border-blue-500/30 bg-blue-500/10 text-blue-400",
            tab: "slider"
          },
          {
            title: isRtl ? "أنواع وأقسام السكراب" : "Scrap Categories",
            count: totalCategories,
            badge: isRtl ? "محدثة كاش" : "Daily Rates",
            icon: Layers,
            color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
            tab: "categories"
          },
          {
            title: isRtl ? "المقالات والأخبار" : "Blog Posts",
            count: totalPosts,
            badge: `${cmsData.posts.filter(p => p.status === 'published').length} ${isRtl ? 'منشور' : 'Published'}`,
            icon: FileText,
            color: "border-purple-500/30 bg-purple-500/10 text-purple-400",
            tab: "posts"
          }
        ].map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div 
              key={idx}
              onClick={() => setActiveAdminTab(card.tab)}
              className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                {card.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    {card.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {card.count}
                </h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Inquiries & Quick Draft / Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Customer Inquiries (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-400" />
                <h2 className="font-extrabold text-white text-base">
                  {isRtl ? "أحدث طلبات تقييم وشراء السكراب" : "Recent Scrap Buying Inquiries"}
                </h2>
              </div>

              <button
                onClick={() => setActiveAdminTab('inquiries')}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                {isRtl ? "عرض الكل ←" : "View All →"}
              </button>
            </div>

            {cmsData.inquiries.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">
                {isRtl ? "لا توجد طلبات حالية" : "No current inquiries"}
              </p>
            ) : (
              <div className="space-y-2.5">
                {cmsData.inquiries.slice(0, 4).map((inq) => (
                  <div key={inq.id} className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-xs">{inq.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{inq.phone}</span>
                      </div>
                      <p className="text-slate-300 text-xs mt-1">
                        <strong className="text-emerald-400">{inq.materialType}:</strong> {inq.estimatedWeight || inq.notes || 'طلب تسعيرة'}
                      </p>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{inq.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${
                        inq.status === 'new' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {inq.status === 'new' ? (isRtl ? 'جديد' : 'New') : (isRtl ? 'متابع' : 'Contacted')}
                      </span>

                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{isRtl ? "واتساب" : "WhatsApp"}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Published Articles Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h2 className="font-extrabold text-white text-base">
                  {isRtl ? "المقالات والأخبار المنشورة بالموقع" : "Published Articles & Blog Posts"}
                </h2>
              </div>

              <button
                onClick={() => setActiveAdminTab('posts')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? "كتابة مقال جديد" : "Create Post"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cmsData.posts.slice(0, 2).map((post) => (
                <div key={post.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={post.featuredImage} alt={post.titleAr} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div>
                      <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                        {post.category}
                      </span>
                      <h4 className="font-bold text-white text-xs line-clamp-1 mt-1">{isRtl ? post.titleAr : post.titleEn}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-2">
                    <span>{post.date}</span>
                    <span>{post.views} {isRtl ? 'مشاهدة' : 'Views'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Trends & Popular Queries Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                <h2 className="font-extrabold text-white text-base">
                  {isRtl ? "أبرز كلمات البحث واهتمامات الزوار (Search Trends)" : "Top Search Queries & Customer Intent"}
                </h2>
              </div>

              <button
                onClick={() => setActiveAdminTab('search-analytics')}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                {isRtl ? "تقرير التحليلات الكامل ←" : "Full Analytics →"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(cmsData.searchLogs || []).slice(0, 3).map((srch) => (
                <div key={srch.id} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 font-extrabold px-1.5 py-0.5 rounded">
                      {srch.category || (isRtl ? 'عام' : 'General')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{srch.count} {isRtl ? 'مرة' : 'x'}</span>
                  </div>
                  <h4 className="font-extrabold text-white text-xs line-clamp-1">{srch.query}</h4>
                  <span className="text-[9px] text-slate-500 mt-1">{srch.lastSearched}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: WordPress Quick Draft Widget & Quick Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Draft Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-extrabold text-white text-sm">
                {isRtl ? "مسودة مقال سريعة (Quick Draft)" : "SoftDows Quick Draft"}
              </h3>
            </div>

            {draftSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs p-2 rounded-lg mb-3 text-center font-bold">
                {isRtl ? "تم حفظ المسودة بنجاح!" : "Draft Saved Successfully!"}
              </div>
            )}

            <form onSubmit={handleSaveQuickDraft} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder={isRtl ? "عنوان المقال أو الخبر..." : "Article Title..."}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder={isRtl ? "اكتب أفكار المقال أو الملاحظات..." : "Draft content or quick notes..."}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2 rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                {isRtl ? "حفظ كمسودة" : "Save Draft"}
              </button>
            </form>
          </div>

          {/* Quick Customization Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-extrabold text-white text-sm mb-3">
              {isRtl ? "روابط التخصيص السريع" : "Quick Management Links"}
            </h3>

            <div className="space-y-2">
              {[
                { title: isRtl ? "إعدادات أرقام الاتصال والواتساب" : "Phone & WhatsApp Settings", tab: "settings", icon: PhoneCall },
                { title: isRtl ? "تغيير صور وعبارات السلايدر" : "Hero Slider & Photos", tab: "slider", icon: Sliders },
                { title: isRtl ? "تعديل أسعار وأنواع السكراب" : "Scrap Buying Rates", tab: "categories", icon: Layers },
                { title: isRtl ? "تخصيص الثيم والألوان" : "Theme & Colors", tab: "customization", icon: Palette },
              ].map((item, idx) => {
                const IconC = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveAdminTab(item.tab)}
                    className="w-full text-start bg-slate-950/80 hover:bg-slate-800 border border-slate-800 p-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <IconC className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.title}</span>
                    </div>
                    <span className="text-slate-500">→</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
