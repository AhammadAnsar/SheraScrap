import { isContentPublished } from '../utils/publication';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCMS } from '../static/CMSContext';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import NotFoundPage from './NotFoundPage';

interface DynamicPageProps {
  lang: 'ar' | 'en';
}

export default function DynamicPage({ lang }: DynamicPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const page = cmsData.pages.find(p => p.slug === slug);

  if (!page || !isContentPublished(page)) {
    return <NotFoundPage lang={lang} />;
  }

  const title = isRtl ? page.titleAr : page.titleEn;
  const content = isRtl ? page.contentAr : page.contentEn;
  const sanitizedContent = sanitizeHtml(content);

  return (
    <>
      <SEO 
        title={isRtl ? page.seoTitleAr || page.titleAr : page.seoTitleEn || page.titleEn} 
        description={isRtl ? page.seoDescriptionAr : page.seoDescriptionEn}
        canonicalPath={`/${lang}/pages/${page.slug}/`}
        lang={lang}
      />
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-bold mb-6">
          <Link reloadDocument to={`/${lang}/`} className="hover:text-emerald-600 transition-colors">
            {isRtl ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-900 truncate">{title}</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">{title}</h1>
        <div 
          className="content-prose"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </>
  );
}
