import fs from 'fs';
import path from 'path';
import { renderSsrPage } from '../src/server/ssrRenderer';
import {
  getAllCategories,
  getAllServices,
  getAllLocations,
  getPublishedPosts,
  getPublishedPages,
} from '../src/data/repository';

async function runPrerender() {
  console.log('🚀 Starting Static Site Generation (SSG) Pre-render...');

  const distDir = path.resolve(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ Error: dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Collect unique list of all routes across both languages
  const routesToRender = new Set<string>();

  // 1. Language Homepages & Static Pages
  const staticSections = [
    '',
    'about/',
    'contact/',
    'services/',
    'locations/',
    'blog/',
    'estimator/',
    'faq/',
  ];

  for (const lang of ['ar', 'en']) {
    for (const sec of staticSections) {
      routesToRender.add(`/${lang}/${sec}`);
    }
  }

  // 2. Service & Category Routes
  const categories = getAllCategories();
  const services = getAllServices();
  const serviceSlugs = new Set<string>();

  for (const cat of categories) {
    if (cat.slug) serviceSlugs.add(cat.slug);
  }
  for (const srv of services) {
    if (srv.slug) serviceSlugs.add(srv.slug);
  }

  // Ensure default known slugs are always included
  serviceSlugs.add('copper');
  serviceSlugs.add('air-conditioners');
  serviceSlugs.add('iron-scrap');
  serviceSlugs.add('aluminum-scrap');
  serviceSlugs.add('cars-machinery');
  serviceSlugs.add('batteries-electronics');
  serviceSlugs.add('copper-scrap');
  serviceSlugs.add('used-air-conditioners');

  for (const slug of serviceSlugs) {
    routesToRender.add(`/ar/services/${slug}/`);
    routesToRender.add(`/en/services/${slug}/`);
  }

  // 3. Location Routes
  const locations = getAllLocations();
  const locationSlugs = new Set<string>();
  for (const loc of locations) {
    if (loc.slug) locationSlugs.add(loc.slug);
  }
  locationSlugs.add('restaurant-equipment-dammam');
  locationSlugs.add('scrap-metals-dammam');
  locationSlugs.add('used-furniture-jubail');
  locationSlugs.add('ac-scrap-jubail');
  locationSlugs.add('used-furniture-khobar');

  for (const slug of locationSlugs) {
    routesToRender.add(`/ar/locations/${slug}/`);
    routesToRender.add(`/en/locations/${slug}/`);
  }

  // 4. Published Blog Posts
  const posts = getPublishedPosts();
  for (const post of posts) {
    if (post.slug) {
      routesToRender.add(`/ar/blog/${post.slug}/`);
      routesToRender.add(`/en/blog/${post.slug}/`);
    }
  }

  // 5. Published Dynamic Pages
  const pages = getPublishedPages();
  for (const page of pages) {
    if (page.slug && page.slug !== 'home' && page.slug !== 'about' && page.slug !== 'contact' && page.slug !== 'services' && page.slug !== 'blog') {
      routesToRender.add(`/ar/pages/${page.slug}/`);
      routesToRender.add(`/en/pages/${page.slug}/`);
    }
  }

  console.log(`📦 Found ${routesToRender.size} routes to pre-render.`);

  let renderedCount = 0;

  for (const route of routesToRender) {
    try {
      const result = await renderSsrPage(route, baseTemplate);

      if (result.statusCode === 200 && result.html) {
        // Output path: dist/[route]/index.html
        const routePathClean = route.replace(/^\/|\/$/g, '');
        const targetDir = path.join(distDir, routePathClean);
        fs.mkdirSync(targetDir, { recursive: true });

        const targetFile = path.join(targetDir, 'index.html');
        fs.writeFileSync(targetFile, result.html, 'utf-8');

        // Also output clean dist/[route].html for CDN clean-url lookups
        const flatHtmlFile = path.join(distDir, `${routePathClean}.html`);
        fs.writeFileSync(flatHtmlFile, result.html, 'utf-8');

        renderedCount++;
      } else if (result.redirectUrl) {
        // Generate client-side meta redirect HTML
        const routePathClean = route.replace(/^\/|\/$/g, '');
        const targetDir = path.join(distDir, routePathClean);
        fs.mkdirSync(targetDir, { recursive: true });

        const redirectHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${result.redirectUrl}" />
    <link rel="canonical" href="${result.redirectUrl}" />
    <title>Redirecting...</title>
  </head>
  <body>
    <script>window.location.replace("${result.redirectUrl}");</script>
    <p>Redirecting to <a href="${result.redirectUrl}">${result.redirectUrl}</a>...</p>
  </body>
</html>`;
        fs.writeFileSync(path.join(targetDir, 'index.html'), redirectHtml, 'utf-8');
      }
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to pre-render route ${route}:`, err);
    }
  }

  // 6. Ensure dist/index.html is preserved as SPA fallback shell
  // React Router handles client-side routing and fallback for / and /admin
  fs.writeFileSync(path.join(distDir, 'spa-shell.html'), baseTemplate, 'utf-8');

  // 7. Generate Standalone 404.html
  try {
    const error404Result = await renderSsrPage('/ar/404/', baseTemplate);
    if (error404Result.html) {
      fs.writeFileSync(path.join(distDir, '404.html'), error404Result.html, 'utf-8');
    }
  } catch (e) {
    console.warn('Could not generate custom 404.html:', e);
  }

  console.log(`✅ Successfully pre-rendered ${renderedCount} pages to static HTML in dist/!`);
}

runPrerender().catch(err => {
  console.error('Fatal pre-render error:', err);
  process.exit(1);
});
