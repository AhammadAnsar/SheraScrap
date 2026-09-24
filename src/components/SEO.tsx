import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCMS } from '../cms/CMSContext';
import { SITE_CONFIG, getCanonicalUrl } from '../config/site';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonicalPath?: string;
  url?: string;
  type?: 'website' | 'article';
  lang?: 'ar' | 'en';
  noindex?: boolean;
  schema?: object | object[];
}

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  canonicalPath, 
  url, 
  type = 'website',
  lang,
  noindex = false,
  schema
}: SEOProps) {
  const { cmsData } = useCMS();
  const settings = cmsData.settings;
  const currentLang = lang || (document.documentElement.lang === 'en' ? 'en' : 'ar');
  const isRtl = currentLang === 'ar';

  const defaultTitle = isRtl ? (settings.seoTitleAr || settings.siteTitleAr) : (settings.seoTitleEn || settings.siteTitleEn);
  const defaultDesc = isRtl ? settings.seoDescriptionAr : settings.seoDescriptionEn;
  const defaultKeywords = isRtl ? settings.siteKeywordsAr : settings.siteKeywordsEn;
  const siteName = isRtl ? SITE_CONFIG.business.nameAr : SITE_CONFIG.business.nameEn;

  const finalTitle = title ? (title.includes(SITE_CONFIG.business.shortNameAr) || title.includes(SITE_CONFIG.business.shortNameEn) ? title : `${title} | ${isRtl ? SITE_CONFIG.business.shortNameAr : SITE_CONFIG.business.shortNameEn}`) : defaultTitle;
  const finalDesc = description || defaultDesc;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = image || settings.siteLogo || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&h=630&q=80';
  
  // Canonical URL always adheres to canonical domain https://sherascrap.com
  const path = canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : `/${currentLang}/`);
  const finalCanonicalUrl = getCanonicalUrl(path);

  // Alternate language counterpart
  const altLang = isRtl ? 'en' : 'ar';
  const altPath = path.startsWith(`/${currentLang}/`) ? path.replace(`/${currentLang}/`, `/${altLang}/`) : `/${altLang}/`;
  const altCanonicalUrl = getCanonicalUrl(altPath);

  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet>
      <html lang={currentLang} dir={isRtl ? 'rtl' : 'ltr'} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="robots" content={robots} />
      
      {/* Canonical and Multilingual Alternates */}
      <link rel="canonical" href={finalCanonicalUrl} />
      <link rel="alternate" hrefLang="ar" href={isRtl ? finalCanonicalUrl : altCanonicalUrl} />
      <link rel="alternate" hrefLang="en" href={!isRtl ? finalCanonicalUrl : altCanonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('/ar/')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={isRtl ? 'ar_SA' : 'en_US'} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalCanonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  );
}

export { SEO };
