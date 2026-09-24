import { CMSData } from '../cms/types';
import { SITE_CONFIG, getCanonicalUrl } from '../config/site';
import { defaultLocations } from '../data/defaults';
import { isContentPublished } from '../data/repository';

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

/**
 * Dynamically generates standard XML sitemap from authoritative CMS state
 * Compliant with Phase 9: Real 200 indexable URLs, zero hash URLs, correct canonical domain.
 */
export function generateSitemapXml(cmsData: CMSData): string {
  const today = new Date().toISOString().split('T')[0];
  const urls: SitemapUrlEntry[] = [];

  // Core Static multilingual routes
  const staticPages = [
    { path: '', freq: 'daily', priority: '1.0' },
    { path: 'about/', freq: 'monthly', priority: '0.8' },
    { path: 'contact/', freq: 'daily', priority: '0.9' },
    { path: 'services/', freq: 'daily', priority: '0.9' },
    { path: 'blog/', freq: 'daily', priority: '0.8' },
    { path: 'estimator/', freq: 'weekly', priority: '0.9' },
    { path: 'faq/', freq: 'weekly', priority: '0.7' },
  ];

  for (const page of staticPages) {
    for (const lang of SITE_CONFIG.supportedLanguages) {
      const relativePath = page.path ? `/${lang}/${page.path}` : `/${lang}/`;
      urls.push({
        loc: getCanonicalUrl(relativePath),
        lastmod: today,
        changefreq: page.freq as any,
        priority: page.priority,
      });
    }
  }

  // Scrap Services / Categories
  if (cmsData.categories && Array.isArray(cmsData.categories)) {
    for (const cat of cmsData.categories) {
      const slug = cat.slug || cat.id;
      for (const lang of SITE_CONFIG.supportedLanguages) {
        urls.push({
          loc: getCanonicalUrl(`/${lang}/services/${slug}/`),
          lastmod: today,
          changefreq: 'weekly',
          priority: '0.9',
        });
      }
    }
  }

  // Blog Posts (Only Published)
  if (cmsData.posts && Array.isArray(cmsData.posts)) {
    for (const post of cmsData.posts) {
      if (!isContentPublished(post)) continue;
      const slug = post.slug || `post-${post.id}`;
      const lastmod = post.date || today;
      for (const lang of SITE_CONFIG.supportedLanguages) {
        urls.push({
          loc: getCanonicalUrl(`/${lang}/blog/${slug}/`),
          lastmod: lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        });
      }
    }
  }

  // Location Landing Pages (Only Published)
  const locations = (cmsData.locations && cmsData.locations.length > 0) ? cmsData.locations : defaultLocations;
  for (const loc of locations) {
    if (!loc.isPublished) continue;
    const slug = loc.slug;
    for (const lang of SITE_CONFIG.supportedLanguages) {
      urls.push({
        loc: getCanonicalUrl(`/${lang}/locations/${slug}/`),
        lastmod: loc.updatedAt || today,
        changefreq: 'weekly',
        priority: '0.9',
      });
    }
  }

  // Custom CMS Pages (Only Published)
  if (cmsData.pages && Array.isArray(cmsData.pages)) {
    for (const page of cmsData.pages) {
      if (!isContentPublished(page)) continue;
      const slug = page.slug || `page-${page.id}`;
      // Skip system pages like 'contact' or 'about' which are handled under core routes
      if (['about', 'contact', 'blog', 'services', 'faq'].includes(slug)) continue;

      for (const lang of SITE_CONFIG.supportedLanguages) {
        urls.push({
          loc: getCanonicalUrl(`/${lang}/pages/${slug}/`),
          lastmod: page.updatedAt || today,
          changefreq: 'monthly',
          priority: '0.7',
        });
      }
    }
  }

  // Build final XML output
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
  ];

  urls.forEach(item => {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(item.loc)}</loc>`);
    xmlLines.push(`    <lastmod>${item.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${item.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${item.priority}</priority>`);
    xmlLines.push('  </url>');
  });

  xmlLines.push('</urlset>');

  return xmlLines.join('\n');
}

/**
 * Returns summary metrics of the sitemap
 */
export function getSitemapMetrics(cmsData: CMSData) {
  const publishedPostsCount = (cmsData.posts || []).filter(p => p.status === 'published').length;
  const categoriesCount = (cmsData.categories || []).length;
  const publishedPagesCount = (cmsData.pages || []).filter(p => p.isPublished).length;
  const locationsCount = ((cmsData.locations && cmsData.locations.length > 0) ? cmsData.locations : defaultLocations).filter(l => l.isPublished).length;
  const staticCount = 7; // Home, About, Contact, Services, Blog, Estimator, FAQ

  const totalUrlsPerLang = staticCount + categoriesCount + publishedPostsCount + publishedPagesCount + locationsCount;
  const totalUrls = totalUrlsPerLang * SITE_CONFIG.supportedLanguages.length;

  return {
    totalUrls,
    categoriesCount,
    publishedPostsCount,
    publishedPagesCount,
    locationsCount,
    staticCount: staticCount * SITE_CONFIG.supportedLanguages.length,
    lastGenerated: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}
