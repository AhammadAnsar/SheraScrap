import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createGzip } from 'node:zlib';
const root = path.resolve('dist/pages');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif':'image/avif', '.woff2':'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain', '.json':'application/json' };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/') { res.writeHead(301, { Location: '/ar/' }); return res.end(); }
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(url.pathname)); } catch { res.writeHead(400); return res.end(); }
  if (!file.startsWith(root + path.sep)) { res.writeHead(404); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: url.pathname + '/' + url.search }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  const found = fs.existsSync(file) && fs.statSync(file).isFile() && !path.basename(file).startsWith('_');
  if (!found) file = path.join(root, '404.html');
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'};
  if(url.pathname.startsWith('/assets/'))headers['Cache-Control']='public, max-age=31536000, immutable';
  if(url.pathname.startsWith('/resources/'))headers['Cache-Control']='public, max-age=2592000';
  const compress=/\.(html|js|css|xml|txt|json|svg)$/.test(file)&&req.headers['accept-encoding']?.includes('gzip');
  if(compress){headers['Content-Encoding']='gzip';headers.Vary='Accept-Encoding';}
  res.writeHead(found?200:404,headers);
  const stream=fs.createReadStream(file);if(compress)stream.pipe(createGzip()).pipe(res);else stream.pipe(res);
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Static preview: http://127.0.0.1:' + (process.env.PORT || 4173)));
