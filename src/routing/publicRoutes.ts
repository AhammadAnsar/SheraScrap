import type { CMSData } from '../cms/types';
import { isContentPublished } from '../utils/publication';

export const coreSections = ['', 'about', 'contact', 'services', 'locations', 'blog', 'estimator', 'faq'];
export const reservedPageSlugs = ['home', ...coreSections.filter(Boolean)];
export function publicRoutes(data: CMSData): string[] {
  const paths = new Set<string>();
  for (const lang of ['ar', 'en']) {
    for (const section of coreSections) paths.add(`/${lang}/${section ? section + '/' : ''}`);
    for (const item of [...data.categories, ...data.services.filter(s => s.active !== false)]) {
      if (item.slug) paths.add(`/${lang}/services/${item.slug}/`);
    }
    for (const item of data.locations || []) if (isContentPublished(item)) paths.add(`/${lang}/locations/${item.slug}/`);
    for (const item of data.posts) if (isContentPublished(item)) paths.add(`/${lang}/blog/${item.slug}/`);
    for (const item of data.pages) if (isContentPublished(item) && !reservedPageSlugs.includes(item.slug)) paths.add(`/${lang}/pages/${item.slug}/`);
  }
  return [...paths];
}

export function systemPageRedirect(path: string): string | undefined {
  const match = path.match(/^\/(ar|en)\/pages\/([^/]+)\/?$/);
  if (!match || !reservedPageSlugs.includes(match[2])) return;
  return `/${match[1]}/${match[2] === 'home' ? '' : match[2] + '/'}`;
}
