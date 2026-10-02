import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { chooseLanguage } from '../cloudflare/entry.mjs';

// Test the deployed directory using Cloudflare's actual local asset runtime,
// rather than a custom server that cannot validate Cloudflare redirect syntax.
const config = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8'));
assert.equal(config.assets.directory, './dist/pages');
assert.equal(config.assets.not_found_handling, '404-page');
assert.deepEqual(config.assets.run_worker_first,['/'],'Run the language selector only at the root');
assert.equal(config.main,'cloudflare/entry.mjs');
for(const [country,expected] of [['SA','ar'],['AE','ar'],['BH','ar'],['KW','ar'],['QA','ar'],['OM','ar'],['BD','en'],['US','en'],[undefined,'ar']])assert.equal(chooseLanguage({cf:{country},headers:new Headers()}),expected);
assert.equal(chooseLanguage({cf:{country:'US'},headers:new Headers({'user-agent':'Googlebot'})}),'ar');
assert.equal(chooseLanguage({cf:{country:'SA'},headers:new Headers({cookie:'shera_lang=en'})}),'en');
const root = path.resolve(config.assets.directory);
const pagesMode=process.argv.includes('--pages');
const redirects = fs.readFileSync(path.join(root, '_redirects'), 'utf8').trim().split('\n');
assert(redirects.every(line => line.startsWith('/')), 'Redirect sources must be relative paths');
const rules = redirects.map(line => line.trim().split(/\s+/));
assert(rules.every(r => r.length === 3 && r[0] !== r[1]), 'Malformed or self-redirect rule');
const staticRules = rules.filter(([source]) => !/[:*]/.test(source));
assert.equal(new Set(staticRules.map(r => r[0])).size, staticRules.length, 'Duplicate redirect sources');

const listener = net.createServer();
await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
const port = listener.address().port;
await new Promise(resolve => listener.close(resolve));
const base = `http://127.0.0.1:${port}`;
let logs = '';
const args=pagesMode?['pages','dev',root,'--compatibility-date',config.compatibility_date]:['dev','--local'];
const child = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', ...args, '--ip', '127.0.0.1', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' },
});
child.stdout.on('data', data => { logs += data.toString(); });
child.stderr.on('data', data => { logs += data.toString(); });
let failure;
child.on('error', error => { failure = error; });
const request = (pathname, headers = {}) => fetch(base + pathname, { redirect: 'manual', headers, signal: AbortSignal.timeout(10000) });
try {
  const deadline = Date.now() + 45000;
  while (true) {
    if (failure || child.exitCode !== null) throw failure || Error('Cloudflare runtime stopped: ' + logs);
    try { await request('/robots.txt'); break; } catch (error) {
      if (Date.now() >= deadline) throw Error('Cloudflare runtime did not start: ' + logs);
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for(const lang of ['ar','en']){const res=await request('/',{Cookie:`shera_lang=${lang}`});assert.equal(res.status,302);assert.equal(res.headers.get('location'),`/${lang}/`);assert(res.headers.get('cache-control').includes('no-store'));}
  const routes = [...sitemap.matchAll(/<loc>https:\/\/sherascrap.com([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const route of routes) {
    const res = await request(route);
    assert.equal(res.status, 200, route);
    assert(res.headers.get('content-type')?.includes('text/html'), route);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert(!res.headers.get('x-robots-tag')?.includes('noindex'), 'Production path blocked: ' + route);
    const html = await res.text();
    assert(html.includes('https://sherascrap.com' + route), 'Missing canonical: ' + route);
    assert(html.includes('<h1'), 'Missing prerendered content: ' + route);
  }
  for (const [source, destination, code] of staticRules) {
    const res = await request(source);
    assert.equal(res.status, Number(code), 'Redirect status: ' + source);
    assert.equal(new URL(res.headers.get('location'), base).pathname, destination, 'Redirect location: ' + source);
    const final = await request(destination);
    assert.equal(final.status, 200, 'Redirect target unavailable: ' + destination);
  }
  for (const source of ['/category/copper', '/article/how-to-sell-scrap-dammam-best-price', '/articles/how-to-sell-scrap-dammam-best-price']) {
    const res = await request(source);
    assert.equal(res.status, 301, source);
    assert.equal((await request(new URL(res.headers.get('location'), base).pathname)).status, 200, source);
  }
  for (const route of ['/this-page-does-not-exist/', '/ar/services/missing/', '/api/cms', '/admin']) {
    const res = await request(route, { Accept: 'text/html' });
    assert.equal(res.status, 404, 'Real 404 required: ' + route);
    assert((await res.text()).includes('noindex'), '404 HTML must be noindex: ' + route);
  }
  for (const [folder, ext, mime] of [['resources', '.webp', 'image/webp'], ['assets', '.js', 'javascript'], ['assets', '.css', 'text/css']]) {
    const file = fs.readdirSync(path.join(root, folder)).find(f => f.endsWith(ext));
    const res = await request(`/${folder}/${file}`);
    assert.equal(res.status, 200); assert(res.headers.get('content-type')?.includes(mime));
    if (folder === 'assets') assert(res.headers.get('cache-control')?.includes('immutable'));
    assert((await res.arrayBuffer()).byteLength > 0);
  }
  for (const file of ['sitemap.xml', 'robots.txt', 'llms.txt']) assert.equal((await request('/' + file)).status, 200);
  assert(!/Invalid _redirects|Invalid _headers|\[ERROR\]/.test(logs), logs);
  console.log(`PASS: Cloudflare ${pagesMode?'Pages':'Workers'} runtime serves ${routes.length} pages; ${staticRules.length} redirects, security/cache headers, images, sitemap and real 404 verified.`);
} finally {
  child.kill();
  await Promise.race([new Promise(resolve => child.once('exit', resolve)), new Promise(resolve => setTimeout(resolve, 2000))]);
}
