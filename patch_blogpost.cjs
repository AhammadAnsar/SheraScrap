const fs = require('fs');
let code = fs.readFileSync('src/components/BlogPostPage.tsx', 'utf8');

// Replace everything with a clean version using SEO component
const newContent = `import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../cms/CMSContext';
import { ArrowRight, ArrowLeft, Calendar, User, Tag, Eye } from 'lucide-react';
import SEO from './SEO';
import { LanguagePack } from '../types';

export default function BlogPostPage({ lang, setLang, t }: { lang: 'ar' | 'en', setLang: (l: 'ar'|'en') => void, t: LanguagePack }) {
  const { slug } = useParams();
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';
  
  const post = cmsData.posts.find(p => p.id === slug) || cmsData.posts.find(p => p.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) || cmsData.posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="flex-grow flex items-center justify-center flex-col gap-4 py-32">
        <h1 className="text-2xl font-bold text-slate-800">{isRtl ? "المقال غير موجود" : "Article Not Found"}</h1>
        <Link to="/blog" className="text-emerald-600 hover:underline">{isRtl ? "العودة للمقالات" : "Return to Blog"}</Link>
      </div>
    );
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
        type="article"
      />
      <div className="max-w-4xl mx-auto w-full px-4 py-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:text-emerald-700 transition-colors">
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
              {post.views !== undefined && (
                <div className="flex items-center gap-1 ms-auto text-slate-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.views}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight mb-8">
              {title}
            </h1>
            
            <div 
              className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-emerald-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
`;

fs.writeFileSync('src/components/BlogPostPage.tsx', newContent);
console.log("Patched BlogPostPage.tsx");
