import React, { useState } from 'react';
import { FileText, Edit, CheckCircle2, Globe, Sparkles, Eye, Plus, Trash2, Search } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { PageItem } from '../../cms/types';

interface PageManagerProps {
  lang: 'ar' | 'en';
}

export default function PageManager({ lang }: PageManagerProps) {
  const { cmsData, addPage, updatePage, deletePage } = useCMS();
  const isRtl = lang === 'ar';

  const pages = cmsData.pages || [];
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  const filteredPages = pages.filter(p => 
    p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    if (isCreating) {
      addPage(editingPage);
    } else {
      updatePage(editingPage.id, editingPage);
    }

    setEditingPage(null);
    setIsCreating(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const startCreateNew = () => {
    setEditingPage({
      id: '',
      slug: 'new-page',
      titleAr: 'صفحة جديدة',
      titleEn: 'New Page',
      seoTitleAr: 'صفحة جديدة | مؤسسة شيرا',
      seoTitleEn: 'New Page | Shera Scrap',
      seoDescriptionAr: 'وصف الصفحة الجديدة لتهيئتها في محركات البحث',
      seoDescriptionEn: 'New page description for SEO optimization',
      contentAr: 'محتوى الصفحة هنا...',
      contentEn: 'Page content goes here...',
      isPublished: true,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? "إدارة الصفحات الرئيسية (Pages)" : "Page Management"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "إدارة وتحرير صفحات الموقع: الرئيسية، من نحن، خدماتنا، دليل الأسعار، اتصل بنا، والمدونة" 
              : "Manage core site pages: Home, About Us, Services, Pricing Guide, Contact Us, and Blog"}
          </p>
        </div>

        <button
          onClick={startCreateNew}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? "إضافة صفحة جديدة" : "Add New Page"}</span>
        </button>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? "تم حفظ التغييرات على الصفحة بنجاح!" : "Page changes saved successfully!"}</span>
        </div>
      )}

      {/* Quick Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isRtl ? "البحث في الصفحات بالعنوان أو الـ Slug..." : "Search pages by title or slug..."}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Edit Page Modal / Drawer */}
      {editingPage && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Edit className="w-4 h-4 text-emerald-400" />
              <span>
                {isCreating 
                  ? (isRtl ? "إضافة صفحة جديدة" : "Create New Page")
                  : (isRtl ? `تعديل صفحة: ${editingPage.titleAr}` : `Edit Page: ${editingPage.titleEn}`)}
              </span>
            </h2>
            <button
              onClick={() => { setEditingPage(null); setIsCreating(false); }}
              className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-3 py-1 rounded-lg cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "عنوان الصفحة (عربي)" : "Page Title (Arabic)"}
                </label>
                <input
                  type="text"
                  value={editingPage.titleAr}
                  onChange={(e) => setEditingPage({ ...editingPage, titleAr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "عنوان الصفحة (إنجليزي)" : "Page Title (English)"}
                </label>
                <input
                  type="text"
                  value={editingPage.titleEn}
                  onChange={(e) => setEditingPage({ ...editingPage, titleEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الرابط اللطيف (Slug)" : "Page Slug"}
                </label>
                <input
                  type="text"
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "حالة النشر" : "Publishing Status"}
                </label>
                <select
                  value={editingPage.isPublished ? 'published' : 'draft'}
                  onChange={(e) => setEditingPage({ ...editingPage, isPublished: e.target.value === 'published' })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                >
                  <option value="published">{isRtl ? "منشورة (Published)" : "Published"}</option>
                  <option value="draft">{isRtl ? "مسودة (Draft)" : "Draft"}</option>
                </select>
              </div>
            </div>

            {/* Page SEO Section */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-purple-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{isRtl ? "إعدادات SEO الخاصة بهذه الصفحة" : "Page Specific SEO Settings"}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    {isRtl ? "عنوان SEO بالعربية" : "Meta Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingPage.seoTitleAr}
                    onChange={(e) => setEditingPage({ ...editingPage, seoTitleAr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    {isRtl ? "وصف Meta Description بالعربية" : "Meta Description (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingPage.seoDescriptionAr}
                    onChange={(e) => setEditingPage({ ...editingPage, seoDescriptionAr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "محتوى الصفحة (عربي)" : "Page Content (Arabic)"}
              </label>
              <textarea
                value={editingPage.contentAr}
                onChange={(e) => setEditingPage({ ...editingPage, contentAr: e.target.value })}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setEditingPage(null); setIsCreating(false); }}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                {isRtl ? "حفظ الصفحة" : "Save Page"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pages Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPages.map((page) => (
          <div key={page.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
                  /{page.slug}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  page.isPublished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {page.isPublished ? (isRtl ? 'منشورة' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
                </span>
              </div>

              <h3 className="text-sm font-black text-white leading-snug">
                {isRtl ? page.titleAr : page.titleEn}
              </h3>
              <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                {isRtl ? page.seoDescriptionAr : page.seoDescriptionEn}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">
                {isRtl ? `تحديث: ${page.updatedAt}` : `Updated: ${page.updatedAt}`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPage(page);
                    setIsCreating(false);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors cursor-pointer"
                  title={isRtl ? "تعديل" : "Edit"}
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(isRtl ? "هل أنت تأكد من حذف هذه الصفحة؟" : "Are you sure you want to delete this page?")) {
                      deletePage(page.id);
                    }
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title={isRtl ? "حذف" : "Delete"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
