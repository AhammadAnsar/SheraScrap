import path from 'path';
import { getRedirect, getAllPosts, getPostBySlug, getScrapCategoryBySlug, getServiceBySlug, getLocationBySlug } from '../data/repository';

export interface RedirectResolution {
  statusCode: number;
  redirectUrl: string;
}

/**
 * Resolves legacy, managed, and trailing-slash redirects in a single, loop-free 301/302 hop.
 * Returns null if the URL is already canonical or not a redirect target.
 */
export function resolveRedirect(rawUrl: string): RedirectResolution | null {
  // Strip query string and hash for path resolution
  const [urlWithoutQuery] = rawUrl.split(/[?#]/);
  // Normalize consecutive slashes
  const cleanPath = urlWithoutQuery.replace(/\/+/g, '/');

  // 1. Skip non-page routes (API, uploads, static assets)
  if (
    cleanPath.startsWith('/api') ||
    cleanPath.startsWith('/uploads') ||
    cleanPath.startsWith('/@') ||
    path.extname(cleanPath) !== ''
  ) {
    return null;
  }

  // 2. Admin area is handled directly
  if (cleanPath === '/admin' || cleanPath === '/admin/') {
    return null;
  }

  // 3. Root landing page redirects to Arabic default
  if (cleanPath === '' || cleanPath === '/') {
    return {
      statusCode: 302,
      redirectUrl: '/ar/',
    };
  }

  // 4. Resolve candidate destination through rules
  const candidate = findTargetDestination(cleanPath);

  if (candidate) {
    // Prevent redirect chains by following chained redirects to their final destination
    const finalTarget = resolveTerminalDestination(candidate.targetUrl, candidate.statusCode);
    
    // Prevent redirecting to self (loops)
    if (finalTarget.redirectUrl === cleanPath) {
      return null;
    }

    return finalTarget;
  }

  // 5. Enforce trailing slash for directory routes if no rule matched
  if (!cleanPath.endsWith('/')) {
    const trailingSlashUrl = `${cleanPath}/`;
    // Check if trailing slash version triggers a redirect rule
    const trailingCandidate = findTargetDestination(trailingSlashUrl);
    if (trailingCandidate) {
      return resolveTerminalDestination(trailingCandidate.targetUrl, trailingCandidate.statusCode);
    }

    return {
      statusCode: 301,
      redirectUrl: trailingSlashUrl,
    };
  }

  return null;
}

/**
 * Evaluates managed CMS redirects, legacy exact routes, and dynamic patterns
 */
function findTargetDestination(url: string): { statusCode: number; targetUrl: string } | null {
  const normalized = url.replace(/\/+$/, '') || '/';
  const withTrailingSlash = `${normalized}/`;

  // Rule A: Managed CMS Redirects
  const managed = getRedirect(url);
  if (managed && managed.active) {
    const code = parseInt(managed.type, 10) || 301;
    return { statusCode: code, targetUrl: managed.toUrl };
  }

  // Rule B: Exact Historical / Legacy Route Mappings
  const exactLegacyMap: Record<string, string> = {
    '/about': '/ar/about/',
    '/contact': '/ar/contact/',
    '/services': '/ar/services/',
    '/locations': '/ar/locations/',
    '/blog': '/ar/blog/',
    '/article': '/ar/blog/',
    '/articles': '/ar/blog/',
    '/post': '/ar/blog/',
    '/posts': '/ar/blog/',
    '/category': '/ar/services/',
    '/categories': '/ar/services/',
    '/estimator': '/ar/estimator/',
    '/faq': '/ar/faq/',
  };

  if (exactLegacyMap[normalized]) {
    return { statusCode: 301, targetUrl: exactLegacyMap[normalized] };
  }

  // Rule C: Dynamic Historical Patterns without language prefix
  // Ensure we don't interfere with existing /ar/ or /en/ routes
  if (url.startsWith('/ar/') || url.startsWith('/en/')) {
    return null;
  }

  // Pattern: /article/:slug or /articles/:slug or /post/:slug or /posts/:slug or /blog/:slug
  const blogMatch = normalized.match(/^\/(?:article|articles|post|posts|blog)\/(.+)$/);
  if (blogMatch) {
    const rawSlug = blogMatch[1];
    const canonicalSlug = resolvePostSlug(rawSlug);
    if (canonicalSlug) {
      return { statusCode: 301, targetUrl: `/ar/blog/${canonicalSlug}/` };
    }
    return null;
  }

  // Pattern: /category/:slug or /categories/:slug or /services/:slug
  const serviceMatch = normalized.match(/^\/(?:category|categories|services)\/(.+)$/);
  if (serviceMatch) {
    const rawSlug = serviceMatch[1];
    const canonicalSlug = resolveServiceSlug(rawSlug);
    if (canonicalSlug) {
      return { statusCode: 301, targetUrl: `/ar/services/${canonicalSlug}/` };
    }
    return null;
  }

  // Pattern: /location/:slug or /locations/:slug
  const locationMatch = normalized.match(/^\/(?:location|locations)\/(.+)$/);
  if (locationMatch) {
    const rawSlug = locationMatch[1];
    const canonicalSlug = resolveLocationSlug(rawSlug);
    if (canonicalSlug) {
      return { statusCode: 301, targetUrl: `/ar/locations/${canonicalSlug}/` };
    }
    return null;
  }

  // Pattern: /page/:slug or /pages/:slug
  const pageMatch = normalized.match(/^\/(?:page|pages)\/(.+)$/);
  if (pageMatch) {
    const rawSlug = pageMatch[1];
    if (rawSlug === 'about') return { statusCode: 301, targetUrl: '/ar/about/' };
    if (rawSlug === 'contact') return { statusCode: 301, targetUrl: '/ar/contact/' };
    return { statusCode: 301, targetUrl: `/ar/pages/${rawSlug}/` };
  }

  // Pattern: Old Hash-turned-path like /post-xxx or /service-xxx
  if (normalized.startsWith('/post-')) {
    const rawSlug = normalized.replace('/post-', '');
    const canonicalSlug = resolvePostSlug(rawSlug);
    if (canonicalSlug) {
      return { statusCode: 301, targetUrl: `/ar/blog/${canonicalSlug}/` };
    }
    return null;
  }
  if (normalized.startsWith('/service-')) {
    const rawSlug = normalized.replace('/service-', '');
    const canonicalSlug = resolveServiceSlug(rawSlug);
    if (canonicalSlug) {
      return { statusCode: 301, targetUrl: `/ar/services/${canonicalSlug}/` };
    }
    return null;
  }
  if (normalized.startsWith('/page-')) {
    const rawSlug = normalized.replace('/page-', '');
    if (rawSlug === 'about') return { statusCode: 301, targetUrl: '/ar/about/' };
    if (rawSlug === 'contact') return { statusCode: 301, targetUrl: '/ar/contact/' };
    return { statusCode: 301, targetUrl: `/ar/pages/${rawSlug}/` };
  }

  return null;
}

/**
 * Resolves post by slug or legacy ID (returns null if not found)
 */
function resolvePostSlug(rawSlug: string): string | null {
  const clean = rawSlug.replace(/\/+$/, '');
  const posts = getAllPosts();
  const found = posts.find(p => p.id === clean || p.slug === clean);
  return found ? found.slug : null;
}

/**
 * Resolves service by slug or legacy category (returns null if not found)
 */
function resolveServiceSlug(rawSlug: string): string | null {
  const clean = rawSlug.replace(/\/+$/, '');
  const cat = getScrapCategoryBySlug(clean);
  if (cat) return cat.slug;
  const srv = getServiceBySlug(clean);
  if (srv) return srv.slug;
  return null;
}

/**
 * Resolves location by slug (returns null if not found)
 */
function resolveLocationSlug(rawSlug: string): string | null {
  const clean = rawSlug.replace(/\/+$/, '');
  const loc = getLocationBySlug(clean);
  if (loc) return loc.slug;
  return null;
}

/**
 * Collapses redirect chains into a single hop and terminates loops safely.
 */
function resolveTerminalDestination(
  initialTarget: string, 
  initialCode: number, 
  maxHops: number = 5
): RedirectResolution {
  let currentTarget = initialTarget;
  let currentCode = initialCode;
  const visited = new Set<string>();

  for (let i = 0; i < maxHops; i++) {
    if (visited.has(currentTarget)) {
      // Loop detected, terminate at last known good target
      break;
    }
    visited.add(currentTarget);

    // Ensure trailing slash on intermediate directory routes
    if (!currentTarget.endsWith('/') && !currentTarget.includes('?') && !currentTarget.includes('#')) {
      currentTarget = `${currentTarget}/`;
    }

    const nextHop = findTargetDestination(currentTarget);
    if (!nextHop || nextHop.targetUrl === currentTarget) {
      break;
    }

    currentTarget = nextHop.targetUrl;
    currentCode = nextHop.statusCode;
  }

  // Ensure canonical trailing slash
  if (!currentTarget.endsWith('/') && !currentTarget.includes('?') && !currentTarget.includes('#')) {
    currentTarget = `${currentTarget}/`;
  }

  return {
    statusCode: currentCode,
    redirectUrl: currentTarget,
  };
}
