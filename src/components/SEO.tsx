import React from 'react';
import { serializeJson } from '../utils/serialize';
import { useCMS } from '../static/CMSContext';
import { SITE_CONFIG, getCanonicalUrl } from '../config/site';
import pageSeo from '../../content/seo.json';
import { languageCounterpart, serviceAreas } from '../content/serviceAreas';

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
  const currentLang = lang || (typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'ar');
  const isRtl = currentLang === 'ar';
  const override = (pageSeo as Record<string, { title?: string; description?: string; image?: string }>)[canonicalPath || ''];
  title = override?.title || title;
  description = override?.description || description;
  image = override?.image || image;

  const defaultTitle = isRtl ? (settings.seoTitleAr || settings.siteTitleAr) : (settings.seoTitleEn || settings.siteTitleEn);
  const defaultDesc = isRtl ? settings.seoDescriptionAr : settings.seoDescriptionEn;
  const defaultKeywords = isRtl ? settings.siteKeywordsAr : settings.siteKeywordsEn;
  const siteName = isRtl ? SITE_CONFIG.business.nameAr : SITE_CONFIG.business.nameEn;

  const finalTitle = title ? (title.includes(SITE_CONFIG.business.shortNameAr) || title.includes(SITE_CONFIG.business.shortNameEn) ? title : `${title} | ${isRtl ? SITE_CONFIG.business.shortNameAr : SITE_CONFIG.business.shortNameEn}`) : defaultTitle;
  const finalDesc = description || defaultDesc;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = new URL(image && !image.endsWith('.svg') ? image : '/resources/brand/icon-512.png', SITE_CONFIG.canonicalDomain).href;
  
  // Canonical URL always adheres to canonical domain https://sherascrap.com
  const path = canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : `/${currentLang}/`);
  const finalCanonicalUrl = getCanonicalUrl(path);

  // Alternate language counterpart
  const altLang = isRtl ? 'en' : 'ar';
  const altPath = languageCounterpart(path, altLang);
  const altCanonicalUrl = getCanonicalUrl(altPath);

  const robots = (noindex || cmsData.preview) ? 'noindex, nofollow' : 'index, follow';

  return (
    <>

      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="robots" content={robots} />
      
      {/* Canonical and Multilingual Alternates */}
      <link rel="canonical" href={finalCanonicalUrl} />
      <link rel="alternate" hrefLang="ar-SA" href={isRtl ? finalCanonicalUrl : altCanonicalUrl} />
      <link rel="alternate" hrefLang="en-SA" href={!isRtl ? finalCanonicalUrl : altCanonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl(isRtl ? path : altPath)} />

      {settings.googleWebmasterCode && !settings.googleWebmasterCode.includes('shera_scrap_dammam_verification_code') && <meta name="google-site-verification" content={settings.googleWebmasterCode.replace(/^google-site-verification=/, '').trim()} />}
      <meta name="msvalidate.01" content="712C0ADCC860879FC4E1C3983D1FEB58" />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={isRtl ? 'ar_SA' : 'en_SA'} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalCanonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJson([
        { '@context': 'https://schema.org', '@type': ['Organization','LocalBusiness'], '@id': SITE_CONFIG.canonicalDomain + '/#organization', name: siteName, url: SITE_CONFIG.canonicalDomain, logo: SITE_CONFIG.canonicalDomain+'/resources/brand/icon-512.png', telephone: settings.phone, email: settings.email, sameAs:Object.values(SITE_CONFIG.social), areaServed:serviceAreas.map(a=>({'@type':'Place',name:a.name[currentLang]})), address: { '@type': 'PostalAddress', streetAddress: isRtl ? settings.locationAr : settings.locationEn, addressLocality:isRtl?'الدمام':'Dammam',addressRegion:isRtl?'المنطقة الشرقية':'Eastern Province',addressCountry: 'SA' } },
        ...(schema ? (Array.isArray(schema) ? schema : [schema]) : [])
      ]) }} />
    </>
  );
}
export { SEO };
