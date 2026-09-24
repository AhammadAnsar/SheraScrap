import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../cms/CMSContext';
import { ArrowRight, ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import SEO from './SEO';
import { LanguagePack } from '../types';
import NotFoundPage from '../pages/NotFoundPage';

export default function BlogPostPage({ lang, setLang, t }: { lang: 'ar' | 'en', setLang: (l: 'ar'|'en') => void, t: LanguagePack }) {
  const { slug } = useParams();
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';
  
  const post = cmsData.posts.find(p => p.slug === slug || p.id === slug);

  if (!post || post.status !== 'published') {
    return <NotFoundPage lang={lang} />;
  }

  const title = isRtl ? post.titleAr : post.titleEn;
  const content = isRtl ? post.contentAr : post.contentEn;
  const excerpt = isRtl ? post.excerptAr : post.excerptEn;

  return (
    <>
      <SEO 
        title={title}
        description={excerpt}
        image={post.featuredImage}
        canonicalPath={`/${lang}/blog/${post.slug}/`}
        lang={lang}
        type="article"
      />
      <div className="max-w-4xl mx-auto w-full px-4 py-12">
        <Link to={`/${lang}/blog/`} className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:text-emerald-700 transition-colors">
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? "العودة للمقالات" : "Back to Blog"}</span>
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
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
              {title}
            </h1>
            
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line space-y-4">
              {content}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
