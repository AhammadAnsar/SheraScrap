import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'htmlparser2';
import { getElementsByTagName, textContent } from 'domutils';
import { whatsappUrl } from '../src/utils/whatsapp';
const root = path.resolve('dist/pages');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/sherascrap.com([^<]+)<\/loc>/g)].map(m => m[1]);
const titles = new Set<string>();
let imageChecks = 0;
for (const route of routes) {
  const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
  const doc = parseDocument(html);
  const tags = (name: string) => getElementsByTagName(name, doc, true);
  assert.equal(tags('title').length, 1, route + ': one title');
  const title = textContent(tags('title')[0]);
  assert(!titles.has(title), route + ': duplicate title ' + title); titles.add(title);
  assert.equal(tags('h1').length, 1, route + ': one H1');
  const canonicals = tags('link').filter(n => n.attribs.rel === 'canonical');
  assert.equal(canonicals.length, 1);
  assert.equal(canonicals[0].attribs.href, 'https://sherascrap.com' + route);
  assert(tags('meta').some(n => n.attribs.name === 'description' && n.attribs.content.length > 20));
  assert(!tags('meta').some(n => n.attribs.name === 'robots' && n.attribs.content.includes('noindex')));
  assert.equal(tags('html')[0].attribs.lang, route.split('/')[1]);
  assert.equal(tags('html')[0].attribs.dir, route.startsWith('/ar/') ? 'rtl' : 'ltr');
  assert.equal(tags('link').filter(n => n.attribs.hreflang).length, 3);
  assert(!html.includes('Admin Login'));
  for (const node of tags('img')) {
    assert(node.attribs.src?.startsWith('/'), route + ': remote/missing image ' + node.attribs.src);
    assert(fs.existsSync(path.join(root, node.attribs.src)), route + ': missing image ' + node.attribs.src);
    assert('alt' in node.attribs, route + ': missing image alt'); imageChecks++;
  }
  for (const node of tags('a')) {
    const href = node.attribs.href || '';
    if (href.startsWith('/') && !href.startsWith('//')) {
      const pathname = new URL(href, 'https://sherascrap.com').pathname;
      assert(pathname === '/' || routes.includes(pathname) || fs.existsSync(path.join(root, pathname)), route + ': broken internal link ' + href);
    }
  }
  for (const node of tags('script').filter(n => n.attribs.type === 'application/ld+json')) JSON.parse(textContent(node));
  const payload = JSON.parse(textContent(tags('script').find(n => n.attribs.id === '__CMS_DATA__')!));
  assert.equal(payload.users.length, 0); assert.equal(payload.inquiries.length, 0);
}
assert(fs.readFileSync(path.join(root, '404.html'), 'utf8').includes('noindex'));
assert(!fs.existsSync(path.join(root, '_worker.js')));
assert(!fs.existsSync(path.join(root, 'api')));
for (const file of fs.readdirSync(path.join(root, 'assets')).filter(f => f.endsWith('.js'))) {
  const js = fs.readFileSync(path.join(root, 'assets', file), 'utf8');
  assert(!/\/api\/(?:cms|auth|analyze|inquiries)|firebaseapp\.com|signInWithEmailAndPassword/.test(js), 'Runtime backend dependency in ' + file);
}
const message = 'নাম & تفاصيل + #';
const wa = new URL(whatsappUrl('+966 573 690 164', message));
assert.equal(wa.pathname, '/966573690164'); assert.equal(wa.searchParams.get('text'), message);
function walk(dir: string): string[] { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const files = walk(root);
assert(files.length < 20000);
for (const file of files) assert(fs.statSync(file).size < 25 * 1024 * 1024);
console.log(`PASS: ${routes.length} standalone pages, unique titles, H1/canonical/hreflang, schema, internal links, ${imageChecks} local image references, private data exclusion, WhatsApp encoding and Pages file limits.`);
