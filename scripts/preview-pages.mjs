import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist/pages');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' };
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
  res.writeHead(found ? 200 : 404, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Static preview: http://127.0.0.1:' + (process.env.PORT || 4173)));
