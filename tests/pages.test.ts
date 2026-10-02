import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'htmlparser2';
import { getElementsByTagName, textContent } from 'domutils';
import { whatsappUrl } from '../src/utils/whatsapp';
import { areaPath, areaHubPath, serviceAreas, languageCounterpart } from '../src/content/serviceAreas';
const root = path.resolve('dist/pages');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/sherascrap.com([^<]+)<\/loc>/g)].map(m => m[1]);
const titles = new Set<string>();
for(const route of JSON.parse(fs.readFileSync('tests/fixtures/previous-public-routes.json','utf8')))assert(routes.includes(route),'Existing indexed URL lost: '+route);
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
    for(const item of (node.attribs.srcset||'').split(',').filter(Boolean)){const src=item.trim().split(/\s+/)[0];assert(fs.existsSync(path.join(root,src)),route+': missing responsive image '+src);}
  }
  for (const node of tags('a')) {
    const href = node.attribs.href || '';
    if (href.startsWith('/') && !href.startsWith('//')) {
      const pathname = decodeURIComponent(new URL(href, 'https://sherascrap.com').pathname);
      assert(pathname === '/' || routes.includes(pathname) || fs.existsSync(path.join(root, pathname)), route + ': broken internal link ' + href);
    }
  }
  for (const node of tags('script').filter(n => n.attribs.type === 'application/ld+json')) JSON.parse(textContent(node));
  assert(!tags('script').some(n=>n.attribs.id==='__CMS_DATA__'),'Do not ship the content database to browsers');
  assert(tags('link').filter(n=>n.attribs.hreflang).every(n=>routes.includes(decodeURIComponent(new URL(n.attribs.href).pathname))),route+': alternate language target unavailable');
  const other=languageCounterpart(route,route.startsWith('/ar/')?'en':'ar');
  assert(tags('link').some(n=>n.attribs.href==='https://sherascrap.com'+other),route+': wrong counterpart');
  assert(tags('meta').some(n=>n.attribs.name==='msvalidate.01'&&n.attribs.content==='712C0ADCC860879FC4E1C3983D1FEB58'));
  assert(tags('meta').some(n=>n.attribs.name==='google-site-verification'&&n.attribs.content==='mF5X07m12BXh5TiLJwUqZAxZ7VaOkoYOAmY23iuLjJg'));
}
assert(fs.readFileSync(path.join(root, '404.html'), 'utf8').includes('noindex'));
assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'_routes.json'),'utf8')).include,['/']);
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
const sourceData = JSON.parse(fs.readFileSync('content/site.json', 'utf8'));
function verifyResources(value: unknown) {
  if (typeof value === 'string' && /^\/(?:resources|uploads)\//.test(value)) {
    assert(fs.existsSync(path.join(root, value.split(/[?#]/)[0])), 'Missing content image/background: ' + value);
  } else if (Array.isArray(value)) value.forEach(verifyResources);
  else if (value && typeof value === 'object') Object.values(value).forEach(verifyResources);
}
verifyResources(sourceData);
assert.equal(serviceAreas.length,24);
assert.deepEqual(serviceAreas.map(a=>a.name.ar),['الدمام','الخبر','الظهران','الأحساء','الهفوف','المبرز','الجبيل','القطيف','حفر الباطن','رأس تنورة','الخفجي','بقيق','النعيرية','قرية العليا','العديد','سيهات','صفوى','تاروت','عنك','رأس الخير','سلوى','البطحاء','القيصومة','العضيلية']);
assert.equal(new Set(serviceAreas.map(a=>a.intro.en)).size,24);
assert.equal(new Set(serviceAreas.map(a=>a.intro.ar)).size,24);
for(const lang of ['ar','en'] as const){
 const home=fs.readFileSync(path.join(root,lang,'index.html'),'utf8'),hub=fs.readFileSync(path.join(root,areaHubPath(lang),'index.html'),'utf8');
 assert(home.includes(lang==='ar'?'شراء سكراب الدمام':'Scrap Buyer in Dammam'));
 assert(!/Certified Digital Scales|45,000 SAR|Free Truck Pickup|30 minutes/.test(home));
 for(const a of serviceAreas){assert(home.includes(`href="${areaPath(a,lang)}"`));assert(hub.includes(`href="${areaPath(a,lang)}"`));
  const html=fs.readFileSync(path.join(root,areaPath(a,lang),'index.html'),'utf8');
  const doc=parseDocument(html),options=getElementsByTagName('option',doc,true);
  assert.equal(options.filter(o=>serviceAreas.some(a=>a.slug===o.attribs.value)).length,24);
  assert(options.some(o=>o.attribs.value===a.slug&&'selected' in o.attribs));
 }
}
const search=JSON.parse(fs.readFileSync('content/search.json','utf8'));
assert.equal(fs.readFileSync(path.join(root,search.indexNowKey+'.txt'),'utf8'),search.indexNowKey);
assert(fs.statSync(files.find(f=>f.endsWith('.js'))!).size<10000,'Public JS must remain small');
assert(files.length < 20000);
for (const file of files) assert(fs.statSync(file).size < 25 * 1024 * 1024);
console.log(`PASS: ${routes.length} standalone pages, unique titles, H1/canonical/hreflang, schema, internal links, ${imageChecks} local image references, private data exclusion, WhatsApp encoding and Pages file limits.`);
