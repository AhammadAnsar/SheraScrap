import { isContentPublished } from '../utils/publication';
import React, { useState } from 'react';
import { Video, Play, Calendar, Eye, MessageSquare, X, ShieldCheck, Sparkles, Youtube } from 'lucide-react';
import { useCMS } from '../static/CMSContext';
import { BlogPost } from '../cms/types';
import OptimizedImage from './common/OptimizedImage';

interface VideoSectionProps {
  lang: 'ar' | 'en';
}

export default function VideoSection({ lang }: VideoSectionProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const [activeVideo, setActiveVideo] = useState<BlogPost | null>(null);

  // Combine video posts from cmsData.posts (where postType === 'video') and legacy cmsData.videoPosts
  const videoPostsFromPosts = cmsData.posts.filter(p => isContentPublished(p) && p.postType === 'video');

  // Convert legacy videoPosts to BlogPost structure if needed
  const legacyVideoPosts: BlogPost[] = (cmsData.videoPosts || []).map(v => ({
    id: v.id || 'vid-' + Math.random(),
    slug: 'video-' + v.id,
    titleAr: v.titleAr,
    titleEn: v.titleEn,
    excerptAr: v.descriptionAr,
    excerptEn: v.descriptionEn,
    contentAr: v.descriptionAr,
    contentEn: v.descriptionEn,
    category: v.category || 'فيديو خدمة',
    tags: ['فيديو', 'إثبات كاش'],
    featuredImage: v.thumbnail || '/resources/977b74fd04bf7eb7.webp',
    author: 'فريق التوثيق الميداني',
    date: v.date,
    status: 'published',
    views: 150,
    postType: 'video',
    videoUrl: v.videoUrl,
    youtubeId: v.youtubeId || 'dQw4w9WgXcQ'
  }));

  // Deduplicate and filter published videos
  const allVideos = [...videoPostsFromPosts];
  legacyVideoPosts.forEach(lv => {
    if (!allVideos.some(v => v.id === lv.id || v.titleAr === lv.titleAr)) {
      allVideos.push(lv);
    }
  });

  if (allVideos.length === 0) return null;

  const getYoutubeEmbedUrl = (post: BlogPost) => {
    let id = post.youtubeId;
    if (!id && post.videoUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = post.videoUrl.match(regExp);
      id = (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
    }
    return `https://www.youtube.com/embed/${id || 'dQw4w9WgXcQ'}?autoplay=1`;
  };

  const handleWhatsappInquiry = (post: BlogPost) => {
    const text = isRtl
      ? `السلام عليكم، شاهدت فيديو "${post.titleAr}" وأود بيع شحنة سكراب مشابهة والحصول على تسعيرة كاش فورية.`
      : `Hello, I watched video "${post.titleEn}" and I have similar scrap to sell. Please give me a quote.`;
    const url = `https://wa.me/${cmsData.settings.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="bg-slate-900 py-12 md:py-16 border-b border-slate-800 text-white" id="video-proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3.5 py-1 rounded-full text-xs font-black mb-3">
            <Video className="w-3.5 h-3.5 animate-pulse" />
            <span>{isRtl ? "توثيق ميداني ومعاينة حية" : "Live Proof & Service Videos"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug">
            {isRtl ? "فيديوهات التفكيك وإثباتات التسليم الكاش المباشر" : "Scrap Processing & Live Cash Payout Proof Videos"}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">
            {isRtl 
              ? "شاهد كيف نقوم بتفكيك المكيفات والمعدات وتفريغ شحنات النحاس والحديد مع التسليم النقدي الفوري بالموقع" 
              : "Watch live operational videos showing certified scrap weighing, heavy AC removal, and on-site cash payments"}
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allVideos.map((video) => (
            <div 
              key={video.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all group flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Thumbnail Container with Play Overlay */}
                <div 
                  onClick={() => setActiveVideo(video)}
                  className="h-48 overflow-hidden relative cursor-pointer bg-slate-900 group"
                >
                  <OptimizedImage 
                    src={video.featuredImage} 
                    alt={video.titleAr} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                  />
                  
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute top-3 right-3 bg-slate-950/90 text-red-400 text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-sm border border-red-500/20 flex items-center gap-1">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <span>{video.category}</span>
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-red-400" /> {video.date}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-emerald-400" /> {video.views}</span>
                  </div>

                  <h3 
                    onClick={() => setActiveVideo(video)}
                    className="text-base font-black text-white group-hover:text-red-400 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {isRtl ? video.titleAr : video.titleEn}
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {isRtl ? video.excerptAr : video.excerptEn}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 pt-0 border-t border-slate-900 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-red-500 fill-current" />
                  <span>{isRtl ? "تشغيل الفيديو" : "Watch Video"}</span>
                </button>

                <button
                  onClick={() => handleWhatsappInquiry(video)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-3 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isRtl ? "طلب سعر مشابه" : "Inquire Rates"}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                <h3 className="font-black text-sm text-white line-clamp-1">
                  {isRtl ? activeVideo.titleAr : activeVideo.titleEn}
                </h3>
              </div>

              <button 
                onClick={() => setActiveVideo(null)}
                className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <iframe
                src={getYoutubeEmbedUrl(activeVideo)}
                title={activeVideo.titleAr}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border-t border-slate-800">
              <div className="text-slate-300 text-xs leading-relaxed max-w-xl">
                <p className="font-extrabold text-white mb-1">{activeVideo.category}</p>
                <p>{isRtl ? activeVideo.excerptAr : activeVideo.excerptEn}</p>
              </div>

              <button
                onClick={() => handleWhatsappInquiry(activeVideo)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isRtl ? "بيع سكراب مشابه عبر الواتساب" : "Sell Similar Scrap via WhatsApp"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
