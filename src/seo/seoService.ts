import { SITE_CONFIG, getCanonicalUrl } from '../config/site';

export interface SeoMetadataOptions {
  title: string;
  description: string;
  canonicalPath: string;
  lang: 'ar' | 'en';
  type?: 'website' | 'article' | 'service';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; path: string }>;
  schema?: object | object[];
}

export interface RenderedSeoTags {
  title: string;
  metaTagsHtml: string;
  jsonLdHtml: string;
}

export function buildSeoMetadata(options: SeoMetadataOptions): RenderedSeoTags {
  const {
    title,
    description,
    canonicalPath,
    lang,
    type = 'website',
    image = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&h=630&q=80',
    publishedTime,
    modifiedTime,
    noindex = false,
    breadcrumbs,
    schema,
  } = options;

  const canonicalUrl = getCanonicalUrl(canonicalPath);
  const isAr = lang === 'ar';
  const siteName = isAr ? SITE_CONFIG.business.nameAr : SITE_CONFIG.business.nameEn;
  const fullTitle = title.includes(SITE_CONFIG.business.shortNameAr) || title.includes(SITE_CONFIG.business.shortNameEn) 
    ? title 
    : `${title} | ${isAr ? SITE_CONFIG.business.shortNameAr : SITE_CONFIG.business.shortNameEn}`;

  // Corresponding alternate path
  const altLang = isAr ? 'en' : 'ar';
  const altPath = canonicalPath.startsWith(`/${lang}/`) 
    ? canonicalPath.replace(`/${lang}/`, `/${altLang}/`) 
    : `/${altLang}/`;
  const altCanonicalUrl = getCanonicalUrl(altPath);

  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const metaLines: string[] = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<link rel="alternate" hreflang="ar" href="${isAr ? canonicalUrl : altCanonicalUrl}" />`,
    `<link rel="alternate" hreflang="en" href="${!isAr ? canonicalUrl : altCanonicalUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${getCanonicalUrl('/ar/')}" />`,

    // Open Graph
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="${isAr ? 'ar_SA' : 'en_US'}" />`,

    // Twitter Cards
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ];

  if (publishedTime) {
    metaLines.push(`<meta property="article:published_time" content="${publishedTime}" />`);
  }
  if (modifiedTime) {
    metaLines.push(`<meta property="article:modified_time" content="${modifiedTime}" />`);
  }

  // Build JSON-LD Structured Data
  const schemaList: object[] = [];

  // Default Organization / Local Business Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'RecyclingCenter',
    '@id': `${SITE_CONFIG.canonicalDomain}/#organization`,
    'name': isAr ? SITE_CONFIG.business.nameAr : SITE_CONFIG.business.nameEn,
    'alternateName': isAr ? SITE_CONFIG.business.shortNameAr : SITE_CONFIG.business.shortNameEn,
    'url': SITE_CONFIG.canonicalDomain,
    'logo': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80',
    'image': image,
    'telephone': SITE_CONFIG.business.phone,
    'email': SITE_CONFIG.business.email,
    'priceRange': SITE_CONFIG.business.priceRange,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': isAr ? 'حي الخالدية' : 'Al Khaldiyah District',
      'addressLocality': isAr ? SITE_CONFIG.business.cityAr : SITE_CONFIG.business.cityEn,
      'addressRegion': isAr ? 'المنطقة الشرقية' : 'Eastern Province',
      'addressCountry': SITE_CONFIG.business.countryCode,
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': SITE_CONFIG.business.geo.latitude,
      'longitude': SITE_CONFIG.business.geo.longitude,
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      'opens': '00:00',
      'closes': '23:59',
    },
    'sameAs': [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.tiktok,
      SITE_CONFIG.social.youtube,
    ].filter(Boolean),
  };
  schemaList.push(organizationSchema);

  // BreadcrumbList Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': getCanonicalUrl(crumb.path),
      })),
    };
    schemaList.push(breadcrumbSchema);
  }

  // Custom Page Schemas (e.g. Article, Service, FAQ)
  if (schema) {
    if (Array.isArray(schema)) {
      schemaList.push(...schema);
    } else {
      schemaList.push(schema);
    }
  }

  const jsonLdHtml = `<script type="application/ld+json">\n${JSON.stringify(schemaList, null, 2)}\n</script>`;

  return {
    title: fullTitle,
    metaTagsHtml: metaLines.join('\n    '),
    jsonLdHtml,
  };
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
