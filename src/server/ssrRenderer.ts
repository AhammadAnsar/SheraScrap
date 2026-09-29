import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { getPublicData } from './publicData';
import { getPostBySlug, getPageBySlug } from '../data/repository';
import { resolveRedirect } from './redirectService';
import { publicRoutes, systemPageRedirect } from '../routing/publicRoutes';
import { serializeJson } from '../utils/serialize';
import { verifyPreviewToken } from './previewService';

export interface SsrRenderResult { statusCode: number; redirectUrl?: string; html?: string; }
export async function renderSsrPage(urlPath: string, template: string, options?: { preview?: boolean; previewToken?: string; user?: any }): Promise<SsrRenderResult> {
  const url = new URL(urlPath, 'http://localhost');
  const path = url.pathname;
  const alias = systemPageRedirect(path);
  const redirect = alias ? { statusCode: 301, redirectUrl: alias } : resolveRedirect(path);
  if (redirect) return { ...redirect, redirectUrl: redirect.redirectUrl + (redirect.redirectUrl.includes('?') ? '' : url.search) };
  const data = getPublicData();
  let preview = false;
  const match = path.match(/^\/(ar|en)\/(blog|pages)\/([^/]+)\/$/);
  if (match && (options?.preview || ['1','true'].includes(url.searchParams.get('preview') || ''))) {
    const kind = match[2] === 'blog' ? 'post' : 'page';
    const token = options?.previewToken || url.searchParams.get('token') || url.searchParams.get('preview_token') || '';
    const allowed = options?.user && ['super_admin','administrator','editor'].includes(options.user.role);
    if (allowed || verifyPreviewToken(token, kind, match[3])) {
      const item = kind === 'post' ? getPostBySlug(match[3], true) : getPageBySlug(match[3], true);
      if (item) {
        preview = true;
        const items: any[] = kind === 'post' ? data.posts : data.pages;
        items.splice(0, items.length, ...items.filter(i => i.slug !== match[3]), { ...item, status: 'published', isPublished: true, scheduledFor: undefined } as any);
      }
    }
  }
  data.preview = preview;
  const admin = /^\/admin(?:\/.*)?$/.test(path);
  const statusCode = admin || publicRoutes(data).includes(path) ? 200 : 404;
  data.notFound = statusCode === 404;
  const lang = admin || path.startsWith('/en/') ? 'en' : 'ar';
  const app = React.createElement(ErrorBoundary, null, React.createElement(App, { initialData: data, serverLocation: url.pathname + url.search }));
  let body = renderToString(app);
  // React 19 hoists resource and metadata elements. Put those same elements in
  // the document head; hydration adopts them instead of adding a second SEO set.
  const head: string[] = [];
  body = body.replace(/<title[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>/gi, tag => { head.push(tag); return ''; });
  const bootstrap = '<script id="__CMS_DATA__" type="application/json">' + serializeJson(data) + '</script>';
  const html = template
    .replace(/<html[^>]*>/i, '<html lang="' + lang + '" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '" class="dark">')
    .replace('<!-- SSR_HEAD_INJECTION -->', head.join('\n'))
    .replace('<div id="root"></div>', '<div id="root">' + body + '</div>' + bootstrap);
  return { statusCode, html };
}
