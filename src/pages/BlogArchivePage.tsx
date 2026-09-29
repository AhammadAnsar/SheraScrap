import React from 'react';
import SEO from '../components/SEO';
import BlogSection from '../components/BlogSection';
import VideoSection from '../components/VideoSection';
import { LanguagePack } from '../types';

interface BlogArchivePageProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function BlogArchivePage({ lang, t }: BlogArchivePageProps) {
  const isRtl = lang === 'ar';
  return (
    <>
      <SEO 
        title={isRtl ? "المقالات والأخبار | مدونة السكراب" : "Blog & News | Scrap Market Insights"} 
        description={isRtl ? "أحدث المقالات والنصائح في مجال تدوير السكراب وتقييم أسعار المعادن والمكيفات بالدمام." : "Latest articles, market insights and selling tips for metal scrap and used AC units."} 
        canonicalPath={`/${lang}/blog/`}
        lang={lang}
      />
      <div className="pt-8 bg-slate-50">
        <h1 className="text-3xl font-black text-center pt-8">{isRtl ? "المدونة" : "Blog & News"}</h1>
        <BlogSection lang={lang} />
        <VideoSection lang={lang} />
      </div>
    </>
  );
}
