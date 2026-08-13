import React, { useState } from 'react';
import { Video, Plus, Trash2, Edit, CheckCircle2, Play, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { VideoPost } from '../../cms/types';
import ImageUploader from './ImageUploader';

interface VideoPostManagerProps {
  lang: 'ar' | 'en';
}

export default function VideoPostManager({ lang }: VideoPostManagerProps) {
  const { cmsData, addVideoPost, updateVideoPost, deleteVideoPost } = useCMS();
  const isRtl = lang === 'ar';

  const videos = cmsData.videoPosts || [];
  const [activeTab, setActiveTab] = useState<'all' | 'purchase_proof' | 'service_guide'>('all');
  const [editingVideo, setEditingVideo] = useState<VideoPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const filteredVideos = videos.filter(v => activeTab === 'all' || v.type === activeTab);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    if (isCreating) {
      addVideoPost(editingVideo);
    } else {
      updateVideoPost(editingVideo.id, editingVideo);
    }

    setEditingVideo(null);
    setIsCreating(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const startCreateNew = (type: 'purchase_proof' | 'service_guide') => {
    setEditingVideo({
      id: '',
      titleAr: type === 'purchase_proof' ? 'فيديو تفريغ سكراب كاش فوري' : 'دليل خدمات التفكيك والنقل',
      titleEn: type === 'purchase_proof' ? 'Scrap Purchase Proof Video' : 'Service Guide Video',
      descriptionAr: 'وصف للفيديو وما يحتوي من إثباتات أو معلومات مفيدة للعملاء.',
      descriptionEn: 'Video description and proof details for clients.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      type: type,
      category: 'سكراب معادن',
      date: new Date().toISOString().split('T')[0],
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80'
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            <span>{isRtl ? "إدارة فيديوهات السكراب (Video Posts)" : "Video Post Management"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "إدارة فيديوهات إثبات الشراء والتفريغ الحقيقي وفيديوهات دليل الخدمات والتثقيف" 
              : "Manage purchase proof videos and educational service guide videos"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startCreateNew('purchase_proof')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? "فيديو إثبات شراء" : "Add Purchase Proof"}</span>
          </button>
          
          <button
            onClick={() => startCreateNew('service_guide')}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? "فيديو دليل خدمات" : "Add Service Guide"}</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? "تم حفظ فيديو السكراب بنجاح!" : "Video post saved successfully!"}</span>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
            activeTab === 'all' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          {isRtl ? "جميع الفيديوهات" : "All Videos"} ({videos.length})
        </button>

        <button
          onClick={() => setActiveTab('purchase_proof')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'purchase_proof' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>{isRtl ? "إثبات الشراء (Purchase Proof)" : "Purchase Proof"}</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">
            {videos.filter(v => v.type === 'purchase_proof').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('service_guide')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'service_guide' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isRtl ? "دليل الخدمات (Service Guide)" : "Service Guide"}</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">
            {videos.filter(v => v.type === 'service_guide').length}
          </span>
        </button>
      </div>

      {/* Edit Video Form Modal */}
      {editingVideo && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              <span>
                {isCreating ? (isRtl ? "إضافة فيديو سكراب جديد" : "Add New Video Post") : (isRtl ? "تعديل فيديو" : "Edit Video Post")}
              </span>
            </h2>
            <button
              onClick={() => { setEditingVideo(null); setIsCreating(false); }}
              className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-3 py-1 rounded-lg cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "عنوان الفيديو (عربي)" : "Video Title (Arabic)"}
                </label>
                <input
                  type="text"
                  value={editingVideo.titleAr}
                  onChange={(e) => setEditingVideo({ ...editingVideo, titleAr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "عنوان الفيديو (إنجليزي)" : "Video Title (English)"}
                </label>
                <input
                  type="text"
                  value={editingVideo.titleEn}
                  onChange={(e) => setEditingVideo({ ...editingVideo, titleEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "نوع الفيديو" : "Video Category Type"}
                </label>
                <select
                  value={editingVideo.type}
                  onChange={(e) => setEditingVideo({ ...editingVideo, type: e.target.value as 'purchase_proof' | 'service_guide' })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                >
                  <option value="purchase_proof">{isRtl ? "إثبات شراء كاش وتفريغ سكراب (Purchase Proof)" : "Purchase Proof Video"}</option>
                  <option value="service_guide">{isRtl ? "دليل الخدمات والتثقيف (Service Guide)" : "Educational Service Guide"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "رابط فيديو يوتيوب / MP4" : "Video URL / YouTube Embed"}
                </label>
                <input
                  type="text"
                  value={editingVideo.videoUrl}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono"
                  required
                />
              </div>
            </div>

            <ImageUploader
              label={isRtl ? "صورة الغلاف للفيديو (Thumbnail)" : "Video Thumbnail Image"}
              value={editingVideo.thumbnail || ''}
              onChange={(url) => setEditingVideo({ ...editingVideo, thumbnail: url })}
              isRtl={isRtl}
            />

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "وصف وملاحظات الفيديو" : "Video Description"}
              </label>
              <textarea
                value={editingVideo.descriptionAr}
                onChange={(e) => setEditingVideo({ ...editingVideo, descriptionAr: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setEditingVideo(null); setIsCreating(false); }}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                {isRtl ? "حفظ الفيديو" : "Save Video"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img 
                  src={video.thumbnail || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80'} 
                  alt={video.titleAr} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <span className={`absolute top-2 right-2 text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                  video.type === 'purchase_proof' 
                    ? 'bg-amber-500 text-slate-950 border-amber-400' 
                    : 'bg-cyan-500 text-slate-950 border-cyan-400'
                }`}>
                  {video.type === 'purchase_proof' ? (isRtl ? 'إثبات شراء' : 'Purchase Proof') : (isRtl ? 'دليل خدمات' : 'Service Guide')}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-black text-white leading-snug">
                  {isRtl ? video.titleAr : video.titleEn}
                </h3>
                <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                  {isRtl ? video.descriptionAr : video.descriptionEn}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">{video.date}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingVideo(video); setIsCreating(false); }}
                  className="p-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-lg cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(isRtl ? "هل أنت تأكد من حذف هذا الفيديو؟" : "Delete this video post?")) {
                      deleteVideoPost(video.id);
                    }
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white rounded-lg cursor-pointer"
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
