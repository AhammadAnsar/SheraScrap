import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import type { CMSData } from '../src/cms/types';
import { publicRoutes, reservedPageSlugs } from '../src/routing/publicRoutes';
import { isContentPublished } from '../src/utils/publication';
import { generateSitemapXml } from '../src/utils/sitemapGenerator';
import { serializeJson } from '../src/utils/serialize';

const output = 'dist/pages';
const template = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const data: CMSData = JSON.parse(fs.readFileSync('content/site.json', 'utf8'), (key, value) => ['revisions', 'password', 'notes', 'companyRegNumber', 'totalTransactions'].includes(key) ? undefined : value);
data.posts = data.posts.filter(isContentPublished);
data.pages = data.pages.filter(isContentPublished);
data.locations = (data.locations || []).filter(isContentPublished);
data.services = data.services.filter(s => s.active !== false);
data.users = []; data.inquiries = []; data.searchLogs = []; data.mediaLibrary = [];
data.preview = false;
// Legacy demo videos are not evidence of this business's work.
data.videoPosts = data.videoPosts.filter(v => v.youtubeId !== 'dQw4w9WgXcQ' && !v.videoUrl.includes('dQw4w9WgXcQ'));
data.settings.whatsapp = data.settings.whatsapp.replace(/\D/g, '');
const routes = publicRoutes(data);
for (const route of routes) {
  if (!/^\/(ar|en)\/(?:[a-z0-9-]+\/)*$/.test(route)) throw new Error('Unsafe or unsupported slug: ' + route);
}
function render(route: string, notFound = false) {
  const payload = { ...data, notFound };
  let body = renderToString(<App initialData={payload} serverLocation={route} />);
  const head: string[] = [];
  body = body.replace(/<title[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>/gi, tag => { head.push(tag); return ''; });
  const en = route.startsWith('/en/');
  return template.replace(/<html[^>]*>/i, `<html lang="${en ? 'en' : 'ar'}" dir="${en ? 'ltr' : 'rtl'}">`)
    .replace('<!-- SSR_HEAD_INJECTION -->', head.join('\n'))
    .replace('<div id="root"></div>', `<div id="root">${body}</div><script id="__CMS_DATA__" type="application/json">${serializeJson(payload)}</script>`);
}
for (const route of routes) {
  const file = path.join(output, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(route));
}
fs.writeFileSync(path.join(output, 'index.html'), render('/ar/'));
fs.writeFileSync(path.join(output, '404.html'), render('/en/404/', true));
fs.writeFileSync(path.join(output, 'sitemap.xml'), generateSitemapXml(data));
fs.writeFileSync(path.join(output, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://sherascrap.com/sitemap.xml\n');
fs.writeFileSync(path.join(output, 'llms.txt'), '# Shera Scrap\n\nPublic pages for scrap purchasing services in Dammam and the Eastern Province.\n\n' + routes.map(route => `- https://sherascrap.com${route}`).join('\n') + '\n');
const redirects = ['https://www.sherascrap.com/* https://sherascrap.com/:splat 301', '/ /ar/ 301'];
for (const lang of ['ar', 'en']) for (const slug of reservedPageSlugs) {
  const target = `/${lang}/${slug === 'home' ? '' : slug + '/'}`;
  redirects.push(`/${lang}/pages/${slug} ${target} 301`, `/${lang}/pages/${slug}/ ${target} 301`);
}
for (const route of routes.filter(r => r.startsWith('/ar/'))) {
  const old = route.slice(3);
  if (old !== '/') redirects.push(`${old} ${route} 301`, `${old.slice(0, -1)} ${route} 301`);
}
redirects.push('/category/:slug /ar/services/:slug/ 301', '/article/:slug /ar/blog/:slug/ 301', '/articles/:slug /ar/blog/:slug/ 301');
fs.writeFileSync(path.join(output, '_redirects'), [...new Set(redirects)].join('\n') + '\n');
fs.writeFileSync(path.join(output, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\nhttps://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\nhttps://:branch.:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log(`Generated ${routes.length} independent HTML pages, sitemap, redirects and real 404 page.`);
