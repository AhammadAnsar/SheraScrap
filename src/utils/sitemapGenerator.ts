import type { CMSData } from '../cms/types';
import { getCanonicalUrl } from '../config/site';
import { publicRoutes } from '../routing/publicRoutes';
import { isContentPublished } from './publication';
function escapeXml(value: string) { return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }
export function generateSitemapXml(data: CMSData): string {
  const urls = publicRoutes(data).map(path => {
    const parts = path.split('/').filter(Boolean);
    const item = parts[1] === 'blog' ? data.posts.find(x => x.slug === parts[2]) : parts[1] === 'pages' ? data.pages.find(x => x.slug === parts[2]) : parts[1] === 'locations' ? data.locations?.find(x => x.slug === parts[2]) : undefined;
    const raw = (item as any)?.updatedAt || (item as any)?.date;
    const time = raw ? Date.parse(raw) : NaN;
    const lastmod = Number.isFinite(time) && time <= Date.now() ? '<lastmod>' + new Date(time).toISOString() + '</lastmod>' : '';
    return '  <url><loc>' + escapeXml(getCanonicalUrl(path)) + '</loc>' + lastmod + '</url>';
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>';
}
export function getSitemapMetrics(data: CMSData) {
  return { totalUrls: publicRoutes(data).length, categoriesCount: data.categories.length,
    publishedPostsCount: data.posts.filter(isContentPublished).length,
    publishedPagesCount: data.pages.filter(isContentPublished).length,
    locationsCount: (data.locations || []).filter(isContentPublished).length,
    staticCount: 16, lastGenerated: new Date().toISOString() };
}
