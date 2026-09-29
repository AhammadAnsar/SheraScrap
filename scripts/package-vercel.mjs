import fs from 'node:fs';
import path from 'node:path';
const destination = path.resolve('release', 'shera-scrap-vercel-firebase');
if (fs.existsSync(destination)) throw new Error('Release already exists. Preserve it and choose a new version.');
fs.mkdirSync(destination, { recursive: true });
const entries = ['.github','api','src','scripts','tests','public','data','package.json','package-lock.json','tsconfig.json','vite.config.ts','vercel.json','server.ts','index.html','firebase-applet-config.json','firestore.rules','.env.example','.gitignore','VERCEL-DEPLOYMENT.md','VERCEL-VALIDATION.md'];
for (const entry of entries) fs.cpSync(entry, path.join(destination, entry), { recursive: true });
// The new release's only deployment guide is the Vercel guide.
fs.copyFileSync('VERCEL-DEPLOYMENT.md', path.join(destination, 'README.md'));
fs.copyFileSync('VERCEL-DEPLOYMENT.md', path.join(destination, 'DEPLOYMENT.md'));
const storePath = path.join(destination, 'data/store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
store.users = []; store.inquiries = []; store.auditLogs = [];
if (store.content) for (const key of ['users','inquiries','auditLogs','searchLogs']) delete store.content[key];
fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log(destination);
