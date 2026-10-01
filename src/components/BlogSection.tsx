import { isContentPublished } from '../utils/publication';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Calendar, Eye, ArrowRight, User, X, Sparkles } from 'lucide-react';
import { useCMS } from '../static/CMSContext';
import { BlogPost } from '../cms/types';
import OptimizedImage from './common/OptimizedImage';

interface BlogSectionProps {
  lang: 'ar' | 'en';
}

export default function BlogSection({ lang }: BlogSectionProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const publishedPosts = cmsData.posts.filter(p => isContentPublished(p) && p.postType !== 'video');

  if (publishedPosts.length === 0) return null;

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
  };

  return (
    <section className="bg-white py-12 md:py-16 border-b border-slate-100" id="blog-articles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-700 px-3.5 py-1 rounded-full text-xs font-black mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>{isRtl ? "مدونة وأخبار أسعار السكراب" : "Scrap Market Blog & News"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-snug">
            {isRtl ? "أحدث مقالات وأدلة بيع السكراب بالدمام" : "Latest Scrap Selling Guides & Market Rates"}
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-2">
            {isRtl 
              ? "استكشف أفضل الطرق والنصائح لتقييم وفرز المعادن والمكيفات المستعملة للحصول على أعلى عائد كاش" 
              : "Read expert articles on metal recycling, AC valuation, and top cash selling strategies"}
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedPosts.map((post) => (
            <Link reloadDocument to={`/${lang}/blog/${post.slug || post.id}/`}
              key={post.id}
              onClick={() => handleOpenPost(post)}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between block"
            >
              <div>
                {/* Image */}
                <div className="h-48 overflow-hidden relative bg-slate-200">
                  <OptimizedImage 
                    src={post.featuredImage} 
                    alt={lang === 'ar' ? post.titleAr : post.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 right-3 bg-slate-900/80 text-purple-300 text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-purple-600" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-emerald-600" /> {post.author}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                    {isRtl ? post.titleAr : post.titleEn}
                  </h3>

                  <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                    {isRtl ? post.excerptAr : post.excerptEn}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-purple-700">
                <span className="flex items-center gap-1">
                  {isRtl ? "قراءة المقال الكامل" : "Read Full Article"}
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </span>
                <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post.views}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>

      </section>
  );
}
