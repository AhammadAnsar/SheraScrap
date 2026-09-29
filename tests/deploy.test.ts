import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

// All mutations use a private test copy; the client's store is never modified.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'shera-deploy-test-'));
fs.copyFileSync('data/store.json', path.join(fixture, 'store.json'));
process.env.DATA_DIR = fixture;
const { sanitizeHtml } = await import('../src/utils/sanitizeHtml');
const { serializeJson } = await import('../src/utils/serialize');
const { publicRoutes } = await import('../src/routing/publicRoutes');
const repo = await import('../src/data/repository');
const { getPublicData } = await import('../src/server/publicData');
const { generateSitemapXml } = await import('../src/utils/sitemapGenerator');
const { generatePreviewToken, verifyPreviewToken } = await import('../src/server/previewService');
const { verifyIdToken } = await import('../src/server/auth');
let checks = 0;
function check(value: unknown, message: string) { assert.ok(value, message); checks++; }

for (const payload of ['<img src=x onerror=alert(1)>', '<svg onload="alert(1)"></svg>', '<a href="javascript:alert(1)">click</a>', '<iframe src="https://example.com"></iframe>']) {
  check(!/onerror|onload|javascript:|<iframe|<svg/.test(sanitizeHtml(payload)), 'Unsafe HTML is removed');
}
check(sanitizeHtml('<h2>Heading</h2><p><strong>Body</strong></p>').includes('<strong>Body</strong>'), 'Safe rich text survives');
check(!serializeJson({ text: '</script><script>alert(1)</script>' }).includes('<'), 'JSON cannot terminate a script');
check(await verifyIdToken('test-token:admin@sherascrap.com') === null, 'Production auth rejects simulated tokens');
const token = generatePreviewToken('post', 'exact-slug', 'test@example.invalid');
check(verifyPreviewToken(token, 'post', 'exact-slug'), 'Signed preview works');
check(!verifyPreviewToken(token, 'post', 'exact-slug-extra'), 'Preview requires exact entity match');
check(!verifyPreviewToken(token + 'x', 'post', 'exact-slug'), 'Modified signature rejected');

const original = structuredClone(repo.getCachedCMSData());
repo.setCachedCMSData({ ...original, posts: [], pages: [], locations: [], faqs: [], testimonials: [], slides: [], settings: { ...original.settings, seoTitleEn: 'Persistence regression title', googleWebmasterCode: 'test-verification-token' } });
const empty = getPublicData();
check(empty.posts.length === 0 && empty.pages.length === 0 && empty.locations?.length === 0, 'Authoritative empty collections stay empty');
check(empty.faqs.length === 0 && empty.slides.length === 0 && empty.testimonials.length === 0, 'CMS section updates persist');
check(empty.settings.seoTitleEn === 'Persistence regression title', 'Settings persist');
check(!generateSitemapXml(empty).includes('/blog/how-to-'), 'Unpublished/removed content disappears from sitemap');
const disk = JSON.parse(fs.readFileSync(path.join(fixture, 'store.json'), 'utf8'));
check(disk.content.faqs.length === 0 && disk.settings.seoTitleEn === 'Persistence regression title', 'Changes are written to durable store');
repo.setCachedCMSData({ ...original, settings: { ...original.settings, googleWebmasterCode: 'test-verification-token' } });
const inquiry = repo.createInquiry({ name: 'Unit fixture', phone: '0000000000', notes: 'Preserve inquiry details', status: 'new' });
check(inquiry.notes === 'Preserve inquiry details', 'Inquiry notes persist');

const socket = net.createServer();
socket.listen(0, '127.0.0.1');
await once(socket, 'listening');
const port = (socket.address() as net.AddressInfo).port;
await new Promise<void>(resolve => socket.close(() => resolve()));
const server = spawn(process.execPath, ['scripts/start.mjs'], { env: { ...process.env, PORT: String(port), UPLOADS_DIR: path.join(fixture, 'uploads') }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let log = '';
server.stdout.on('data', chunk => log += chunk);
server.stderr.on('data', chunk => log += chunk);
const base = `http://127.0.0.1:${port}`;
async function request(url: string, init?: RequestInit) { return fetch(base + url, { ...init, redirect: 'manual' }); }
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error(log);
    try { if ((await request('/api/health')).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  check(ready, 'Production server starts with configured PORT');
  const xml = await (await request('/sitemap.xml')).text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  assert.deepEqual(urls.sort(), publicRoutes(getPublicData()).sort()); checks++;
  check(urls.includes('/en/locations/') && urls.includes('/en/services/ac-buying/'), 'Sitemap includes archives and services');
  check(!urls.includes('/en/pages/home/'), 'Sitemap excludes system-page aliases');
  for (const url of urls) {
    const response = await request(url);
    const html = await response.text();
    const head = html.split('</head>')[0];
    check(response.status === 200, url + ' returns 200');
    check((head.match(/rel="canonical"/g) || []).length === 1, url + ' has one canonical in head');
    check(head.includes('href="https://sherascrap.com' + url + '"'), url + ' is self canonical');
    check((head.match(/<title>/g) || []).length === 1, url + ' has one title');
    check(!head.includes('noindex'), url + ' remains indexable');
    check(/<h1\b/.test(html) && html.includes('id="__CMS_DATA__"'), url + ' includes real rendered content and hydration data');
    check(!html.includes('test-token:') && !html.includes('Shera#SuperAdmin'), url + ' does not expose demo credentials');
  }
  for (const url of ['/en/about/extra/', '/en/services/copper/extra/', '/en/blog/missing/', '/en/locations/missing/', '/en/pages/missing/', '/en/missing/', '/xx/', '/services/non-existent-service-slug-xyz/']) {
    const response = await request(url); const html = await response.text();
    check(response.status === 404 && html.includes('noindex'), 'True 404 with noindex: ' + url);
  }
  for (const url of ['/server.cjs', '/server.cjs.map', '/dist/server/server.cjs', '/data/store.json', '/index.html', '/src/App.tsx']) check((await request(url)).status === 404, 'Private artifacts blocked: ' + url);
  for (const url of ['/en/about/?utm_source=google.com', '/en/contact/?email=a%40example.com']) check((await request(url)).status === 200, 'Query punctuation does not break pages');
  for (const [from, to] of [['/about', '/ar/about/'], ['/en/pages/home/', '/en/'], ['/en/about?utm_source=google.com', '/en/about/?utm_source=google.com']]) {
    const response = await request(from);
    check(response.status === 301 && response.headers.get('location') === to, 'Canonical redirect: ' + from);
  }
  const faq = await (await request('/en/faq/')).text();
  check(faq.includes('How is the scrap metal price calculated') && faq.includes('Prices depend on the metal type'), 'FAQ answers exist without JavaScript');
  check(faq.includes('name="google-site-verification" content="test-verification-token"'), 'Verification token is emitted');
  const entities = await (await request('/api/cms/entities')).json();
  check(entities.users.length === 0 && entities.inquiries.length === 0 && !entities.auditLogs, 'Public data omits private records');
  check((await request('/api/admin/entities')).status === 401, 'Admin entities require authentication');
  check((await request('/api/auth/verify-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: 'test-token:admin@sherascrap.com' }) })).status === 403, 'HTTP endpoint rejects forged dev authentication');
  check((await request('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status === 400, 'Invalid inquiry is rejected');
  const submit = await request('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'HTTP fixture', phone: '0000000000', notes: 'Server integration test' }) });
  check(submit.ok, 'Public inquiry saves successfully');
  const saved = JSON.parse(fs.readFileSync(path.join(fixture, 'store.json'), 'utf8'));
  check(saved.inquiries.some((i: any) => i.name === 'HTTP fixture' && i.notes === 'Server integration test'), 'HTTP inquiry is durable, including notes');
  console.log(`PASS: ${checks} assertions across ${urls.length} public routes, security, persistence and inquiry delivery.`);
} finally {
  server.kill();
  if (server.exitCode === null) await once(server, 'exit');
  // Deliberately retain the isolated fixture for diagnosis. Never delete client data.
  console.log('Isolated test fixture:', fixture);
}
