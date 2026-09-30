import assert from 'node:assert/strict';
import { createServer, get } from 'node:http';
import { once } from 'node:events';
import fs from 'node:fs';

process.env.VERCEL = '1';
process.env.VERCEL_ENV = 'preview';
process.env.NODE_ENV = 'production';
process.env.FIREBASE_SERVICE_ACCOUNT_JSON = '{}'; // Intentionally invalid; no live service used.
const { default: handler } = await import('../api/index.js');
const bundledEntry = fs.readFileSync('api/index.js', 'utf8');
assert(!/from\s+["'][./]|require\(["'][./]/.test(bundledEntry), 'Vercel function must not keep local runtime imports');
const server = createServer((req, res) => { void handler(req as any, res as any); });
server.listen(0, '127.0.0.1');
await once(server, 'listening');
try {
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const response = await fetch(base + '/ar/');
  assert.equal(response.status, 503, 'bad credentials produce explicit failure rather than local disk fallback');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert((await response.json()).error.includes('Firebase'));
  const redirect = await new Promise<any>((resolve, reject) => {
    get(base + '/en/about/?x=1', { headers: { Host: 'www.sherascrap.com' } }, response => { response.resume(); resolve(response); }).on('error', reject);
  });
  assert.equal(redirect.statusCode, 308);
  assert.equal(redirect.headers.location, 'https://sherascrap.com/en/about/?x=1');
  assert(!fs.existsSync('dist/static/index.html'), 'SSR shell must never be served as a static page');
  assert(!fs.existsSync('dist/static/server'), 'server bundle is private');
  assert(fs.existsSync('dist/client/index.html'));
} finally {
  await new Promise<void>(resolve => server.close(() => resolve()));
}
console.log('Vercel entrypoint, preview noindex, www canonical redirect and private output checks passed.');
