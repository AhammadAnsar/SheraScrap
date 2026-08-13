import React, { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, Sparkles, X, Check, Search, Calendar, Tag, Video, Youtube, Globe } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { useCMS } from '../../cms/CMSContext';
import { BlogPost } from '../../cms/types';
import ImageUploader from './ImageUploader';

interface PostManagerProps {
  lang: 'ar' | 'en';
}

export default function PostManager({ lang }: PostManagerProps) {
  const { cmsData, addPost, updatePost, deletePost } = useCMS();
  const isRtl = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<'all' | 'article' | 'video'>('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPosts = cmsData.posts.filter(p => {
    const matchesSearch = 
      p.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const type = p.postType || 'article';
    const matchesFormat = filterFormat === 'all' || type === filterFormat;

    return matchesSearch && matchesFormat;
  });

  const extractYoutubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleOpenAdd = (type: 'article' | 'video' = 'article') => {
    setEditingPost({
      id: '',
      slug: 'new-scrap-post-' + Date.now(),
      titleAr: type === 'video' ? 'فيديو إثبات شراء وتفريغ سكراب كاش' : 'عنوان المقال الجديد لشراء السكراب بالدمام',
      titleEn: type === 'video' ? 'Scrap Purchase Proof Video' : 'New Scrap Metal Market Guide in Dammam',
      excerptAr: type === 'video' ? 'فيديو توثيقي لاستلام السكراب وتسليم المبلغ كاش فورياً.' : 'موجز تفصيلي عن أسعار السكراب والخدمات المتاحة بالشرقية.',
      excerptEn: type === 'video' ? 'Video proof of scrap delivery and cash payment.' : 'Detailed summary of scrap prices and available services in Eastern Province.',
      contentAr: type === 'video' ? 'تفاصيل ومعلومات الفيديو الموثق لتفريغ وتداول السكراب.' : `### شراء السكراب بالدمام 2026\n\nنص المقال الكامل والتعليمات الخاصة بالبيع والاستلام الكاش...`,
      contentEn: type === 'video' ? 'Details regarding this proof video.' : `### Scrap Metal Buying in Dammam 2026\n\nFull post content regarding scrap metal evaluation and instant cash payout...`,
      category: type === 'video' ? 'فيديوهات الخدمة' : 'دليل الأسعار',
      tags: ['شراء سكراب', 'الدمام'],
      featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      author: 'إدارة مؤسسة شيرا',
      date: new Date().toISOString().split('T')[0],
      status: 'published',
      views: 0,
      postType: type,
      videoUrl: type === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : '',
      youtubeId: type === 'video' ? 'dQw4w9WgXcQ' : ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost({
      ...post,
      postType: post.postType || 'article'
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    let finalPost = { ...editingPost };
    if (finalPost.postType === 'video' && finalPost.videoUrl) {
      finalPost.youtubeId = extractYoutubeId(finalPost.videoUrl);
    }

    if (finalPost.id) {
      updatePost(finalPost.id, finalPost);
    } else {
      addPost(finalPost);
    }
    setIsModalOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>{isRtl ? "إدارة المقالات والفيديوهات (Post Management)" : "Post & Video Content Manager"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "إضافة وتعديل مقالات المدونة وفيديوهات إثبات الخدمة. يتم التوجيه تلقائياً حسب نوع الفئة (Article / Video)." 
              : "Create & edit blog articles or service videos. Content is auto-routed to Blog or Video section."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleOpenAdd('article')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-3.5 py-2 rounded-xl shadow-lg shadow-purple-600/20 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? "إضافة مقال جديد (Article)" : "New Article"}</span>
          </button>

          <button
            onClick={() => handleOpenAdd('video')}
            className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-3.5 py-2 rounded-xl shadow-lg shadow-red-600/20 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>{isRtl ? "إضافة فيديو (Video)" : "New Video"}</span>
          </button>
        </div>
      </div>

      {/* Format Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        
        {/* Format Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterFormat('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterFormat === 'all' 
                ? 'bg-slate-800 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? "الكل (All Posts)" : "All Posts"}
          </button>

          <button
            onClick={() => setFilterFormat('article')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterFormat === 'article' 
                ? 'bg-purple-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isRtl ? "المقالات (Blog)" : "Articles"}</span>
          </button>

          <button
            onClick={() => setFilterFormat('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterFormat === 'video' 
                ? 'bg-red-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isRtl ? "الفيديوهات (Videos)" : "Videos"}</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute top-2.5 right-3 ltr:right-auto ltr:left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "البحث في العنوان، التنسيق، أو التصنيف..." : "Search posts..."}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-9 text-white text-xs focus:border-purple-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => {
          const isVideo = post.postType === 'video';
          return (
            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden group">
              
              <div className="flex items-start gap-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                  <img src={post.featuredImage} alt={post.titleAr} className="w-full h-full object-cover" />
                  {isVideo && (
                    <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center">
                      <Video className="w-6 h-6 text-red-400 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Format Badge */}
                    {isVideo ? (
                      <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-red-500/20 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>{isRtl ? "فيديو" : "Video"}</span>
                      </span>
                    ) : (
                      <span className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-purple-500/20 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{isRtl ? "مقال" : "Article"}</span>
                      </span>
                    )}

                    <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-bold">
                      {post.category}
                    </span>

                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {post.status === 'published' ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white mt-1.5 line-clamp-2">
                    {isRtl ? post.titleAr : post.titleEn}
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-1 mt-1">
                    {isRtl ? post.excerptAr : post.excerptEn}
                  </p>
                </div>
              </div>

              {/* Destination info pill */}
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>
                    {isVideo 
                      ? (isRtl ? "يظهر في: قسم الفيديوهات (Video Section)" : "Appears in: Video Section")
                      : (isRtl ? "يظهر في: قسم المقالات الأخبار (Blog & News)" : "Appears in: Scrap Blog Section")
                    }
                  </span>
                </span>
                {isVideo && post.videoUrl && (
                  <a href={post.videoUrl} target="_blank" rel="noreferrer" className="text-red-400 hover:underline text-[10px] flex items-center gap-1">
                    <Youtube className="w-3 h-3" />
                    <span>رابط الفيديو</span>
                  </a>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? "تعديل" : "Edit"}</span>
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Post Modal */}
      {isModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
                {editingPost.postType === 'video' ? (
                  <Video className="w-4 h-4 text-red-400" />
                ) : (
                  <FileText className="w-4 h-4 text-purple-400" />
                )}
                <span>
                  {editingPost.id 
                    ? (isRtl ? "تعديل المحتوى" : "Edit Post") 
                    : (editingPost.postType === 'video' ? (isRtl ? "إضافة فيديو إثبات جديد" : "Add Video Post") : (isRtl ? "كتابة مقال جديد" : "New Article"))
                  }
                </span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              
              {/* Format Switcher inside Modal */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-black text-slate-300">
                  {isRtl ? "نوع ونمط المحتوى (Post Format):" : "Post Format & Target Destination:"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPost({ ...editingPost, postType: 'article' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-right flex flex-col justify-between ${
                      editingPost.postType !== 'video'
                        ? 'bg-purple-600/20 border-purple-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-extrabold">
                        <FileText className="w-4 h-4 text-purple-400" />
                        {isRtl ? "مقال / خبر (Article)" : "Article"}
                      </span>
                      {editingPost.postType !== 'video' && <Check className="w-4 h-4 text-purple-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {isRtl ? "ينشر في قسم المقالات والأخبار Scrap Market Blog & News" : "Routes to Blog & News section"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingPost({ ...editingPost, postType: 'video' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-right flex flex-col justify-between ${
                      editingPost.postType === 'video'
                        ? 'bg-red-600/20 border-red-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-extrabold">
                        <Video className="w-4 h-4 text-red-400" />
                        {isRtl ? "فيديو خدمة / إثبات (Video)" : "Video Post"}
                      </span>
                      {editingPost.postType === 'video' && <Check className="w-4 h-4 text-red-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {isRtl ? "ينشر في قسم الفيديوهات والمعاينة الحية Video Section" : "Routes to Video Proof Section"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Video URL Field if format is Video */}
              {editingPost.postType === 'video' && (
                <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span>{isRtl ? "رابط فيديو يوتيوب (YouTube Video URL)" : "YouTube Video URL"}</span>
                  </label>
                  <input
                    type="url"
                    value={editingPost.videoUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required={editingPost.postType === 'video'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  <p className="text-[10px] text-red-400/80">
                    {isRtl 
                      ? "سيتم استخراج معرّف الفيديو وتضمينه تلقائياً في مشغل الفيديو بالصفحة الرئيسية." 
                      : "Video ID will be extracted and embedded automatically into the video section player."}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "العنوان (عربي)" : "Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingPost.titleAr}
                    onChange={(e) => setEditingPost({ ...editingPost, titleAr: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "العنوان (إنجليزي)" : "Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingPost.titleEn}
                    onChange={(e) => setEditingPost({ ...editingPost, titleEn: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "التصنيف (Category)" : "Category"}
                  </label>
                  <input
                    type="text"
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "الحالة (Status)" : "Status"}
                  </label>
                  <select
                    value={editingPost.status}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="published">{isRtl ? "منشور الآن" : "Published"}</option>
                    <option value="draft">{isRtl ? "مسودة فقط" : "Draft"}</option>
                  </select>
                </div>
              </div>

              <ImageUploader
                label={isRtl ? "صورة الغلاف / المعاينة (Upload Thumbnail or Image)" : "Thumbnail / Cover Image"}
                value={editingPost.featuredImage}
                onChange={(url) => setEditingPost({ ...editingPost, featuredImage: url })}
                isRtl={isRtl}
              />

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الموجز / الوصف المختصر (عربي)" : "Excerpt (Arabic)"}
                </label>
                <textarea
                  value={editingPost.excerptAr || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerptAr: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الموجز / الوصف المختصر (إنجليزي)" : "Excerpt (English)"}
                </label>
                <textarea
                  value={editingPost.excerptEn || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerptEn: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "المحتوى (عربي)" : "Content (Arabic)"}
                </label>
                <RichTextEditor
                  value={editingPost.contentAr || ''}
                  onChange={(val) => setEditingPost({ ...editingPost, contentAr: val })}
                  isRtl={isRtl}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "المحتوى (إنجليزي)" : "Content (English)"}
                </label>
                <RichTextEditor
                  value={editingPost.contentEn || ''}
                  onChange={(val) => setEditingPost({ ...editingPost, contentEn: val })}
                  isRtl={false}
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 cursor-pointer"
                >
                  {isRtl ? "حفظ ونشر المحتوى" : "Save & Publish"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
