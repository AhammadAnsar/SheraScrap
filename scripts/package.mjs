import fs from 'node:fs';
import path from 'node:path';
const destination = path.resolve('release', 'shera-scrap-deploy');
if (fs.existsSync(destination)) throw new Error('Release directory already exists; use a new release directory or preserve/remove the previous package explicitly.');
fs.mkdirSync(destination, { recursive: true });
const entries = ['src','scripts','tests','public','data','dist','package.json','package-lock.json','tsconfig.json','vite.config.ts','server.ts','index.html','firebase-applet-config.json','Dockerfile','compose.yaml','.dockerignore','.env.example','.gitignore','README.md','DEPLOYMENT.md','RELEASE-NOTES.md','VALIDATION.md','AUDIT-REPORT.md'];
for (const entry of entries) fs.cpSync(entry, path.join(destination, entry), { recursive: true });
// Passwords are managed by Firebase. Never distribute obsolete password fields.
const storePath = path.join(destination, 'data', 'store.json');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
for (const user of store.users || []) delete user.password;
fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log(destination);
