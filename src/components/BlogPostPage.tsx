import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../cms/CMSContext';
import { ArrowRight, ArrowLeft, Calendar, User, Tag, Eye } from 'lucide-react';
import Header from './Header';
import { LanguagePack } from '../types';

export default function BlogPostPage({ lang, setLang, t }: { lang: 'ar' | 'en', setLang: (l: 'ar'|'en') => void, t: LanguagePack }) {
  const { slug } = useParams();
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';
  
  // Find post by ID for now, since we don't have slugs natively.
  // We'll treat the URL param as the ID.
  const post = cmsData.posts.find(p => p.id === slug) || cmsData.posts.find(p => p.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) {
      const pageTitle = isRtl ? post.titleAr : post.titleEn;
      const excerpt = isRtl ? post.excerptAr : post.excerptEn;
      
      document.title = pageTitle + ' - ' + (cmsData.settings.siteTitleAr || 'Shera Scrap');
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', excerpt || '');

      // Update OG Tags
      const setOgMeta = (property, content) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      setOgMeta('og:title', pageTitle);
      setOgMeta('og:description', excerpt || '');
      if (post.featuredImage) {
        setOgMeta('og:image', post.featuredImage);
      }
    }
  }, [post, isRtl, cmsData.settings.siteTitleAr]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header lang={lang} setLang={setLang} t={t} />
        <div className="flex-grow flex items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-bold text-slate-800">{isRtl ? "المقال غير موجود" : "Article Not Found"}</h1>
          <Link to="/" className="text-emerald-600 hover:underline">{isRtl ? "العودة للرئيسية" : "Return Home"}</Link>
        </div>
      </div>
    );
  }

  const title = isRtl ? post.titleAr : post.titleEn;
  const content = isRtl ? post.contentAr : post.contentEn;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header lang={lang} setLang={setLang} t={t} />
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:text-emerald-700 transition-colors">
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
        </Link>
        
        <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {post.featuredImage && (
            <div className="w-full h-[300px] sm:h-[400px] overflow-hidden bg-slate-100">
              <img 
                src={post.featuredImage} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 mb-6">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{post.category}</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{post.author}</span>
              </div>
              {post.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.views}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight mb-8">
              {title}
            </h1>
            
            <div 
              className="prose prose-slate prose-emerald max-w-none text-slate-700 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:text-xl [&>h3]:font-bold [&>p]:mb-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map(tag => (
                  <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
