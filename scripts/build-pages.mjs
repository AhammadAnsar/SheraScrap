import { build as viteBuild } from 'vite';
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

await viteBuild({ configFile: 'vite.static.config.ts' });
// Bundle the same public components for build-time rendering, without CMS/auth/server code.
await build({
  entryPoints: ['scripts/render-pages.tsx'], outfile: 'dist/render-pages.mjs',
  bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'static-content', setup(builder) {
    builder.onResolve({ filter: /\/cms\/CMSContext$/ }, () => ({ path: path.resolve('src/static/CMSContext.tsx') }));
    builder.onResolve({ filter: /\/ScrapEstimator$/ }, () => ({ path: path.resolve('src/static/QuoteRequest.tsx') }));
  } }],
});
await import(pathToFileURL(path.resolve('dist/render-pages.mjs')).href + '?build=' + Date.now());
for (const folder of ['resources', 'uploads']) {
  const source = path.join('public', folder);
  if (fs.existsSync(source)) fs.cpSync(source, path.join('dist/pages', folder), { recursive: true });
}
console.log('Deploy ONLY dist/pages to Cloudflare Pages. No environment secrets or functions required.');
