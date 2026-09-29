import fs from 'node:fs';
import path from 'node:path';
import { renderSsrPage } from '../src/server/ssrRenderer';
import { getPublicData } from '../src/server/publicData';
import { publicRoutes } from '../src/routing/publicRoutes';
import { generateSitemapXml } from '../src/utils/sitemapGenerator';
// Build-time validation snapshots are private artifacts, never served as stale CMS pages.
const template = fs.readFileSync('dist/client/index.html', 'utf8');
const data = getPublicData();
const routes = publicRoutes(data);
for (const route of routes) {
  const result = await renderSsrPage(route, template);
  if (result.statusCode !== 200 || !result.html) throw new Error('Rendering failed: ' + route);
  const file = path.join('dist/prerender', route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, result.html);
}
fs.mkdirSync('dist/prerender', { recursive: true });
fs.writeFileSync('dist/prerender/sitemap.xml', generateSitemapXml(data));
console.log('Validated and rendered ' + routes.length + ' public routes. Production serves fresh SSR from the CMS.');
