import { CMSData } from '../cms/types';

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

/**
 * Dynamically generates standard XML sitemap from CMS state
 */
export function generateSitemapXml(cmsData: CMSData): string {
  const baseUrl = (cmsData.settings?.siteUrl || 'https://shera-scrap-haraj.com').replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

  // 1. Homepage
  urls.push({
    loc: `${baseUrl}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
  });

  // 2. Main Section Anchors / Dynamic Sections
  const staticSections = [
    { path: '#services', priority: '0.9', freq: 'daily' },
    { path: '#estimator', priority: '0.9', freq: 'daily' },
    { path: '#faq', priority: '0.8', freq: 'weekly' },
    { path: '#testimonials', priority: '0.7', freq: 'weekly' },
    { path: '#contact', priority: '0.9', freq: 'daily' },
  ];

  staticSections.forEach(sec => {
    urls.push({
      loc: `${baseUrl}/${sec.path}`,
      lastmod: today,
      changefreq: sec.freq,
      priority: sec.priority,
    });
  });

  // 3. Scrap Categories Pages & Services
  if (cmsData.categories && Array.isArray(cmsData.categories)) {
    cmsData.categories.forEach(cat => {
      const slug = cat.slug || cat.id || 'scrap-service';
      urls.push({
        loc: `${baseUrl}/#service-${escapeXml(slug)}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.9',
      });
    });
  }

  // 4. Published Blog Posts (Articles)
  if (cmsData.posts && Array.isArray(cmsData.posts)) {
    cmsData.posts
      .filter(post => post.status === 'published')
      .forEach(post => {
        const slug = post.slug || `post-${post.id}`;
        const lastmod = post.date || today;
        urls.push({
          loc: `${baseUrl}/#post-${escapeXml(slug)}`,
          lastmod: lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        });
      });
  }

  // 5. Custom CMS Pages
  if (cmsData.pages && Array.isArray(cmsData.pages)) {
    cmsData.pages
      .filter(page => page.isPublished)
      .forEach(page => {
        const slug = page.slug || `page-${page.id}`;
        urls.push({
          loc: `${baseUrl}/#page-${escapeXml(slug)}`,
          lastmod: today,
          changefreq: 'monthly',
          priority: '0.7',
        });
      });
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
  const staticCount = 6; // Home + 5 sections

  const totalUrls = staticCount + categoriesCount + publishedPostsCount + publishedPagesCount;

  return {
    totalUrls,
    categoriesCount,
    publishedPostsCount,
    publishedPagesCount,
    staticCount,
    lastGenerated: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}
