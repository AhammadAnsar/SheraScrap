import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Build validation reads the packaged seed; runtime always reads Firestore.
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], { stdio: 'inherit', env: { ...process.env, CMS_BUILD: '1' } });
if (result.status !== 0) process.exit(result.status || 1);
fs.mkdirSync('dist/static', { recursive: true });
fs.cpSync('dist/client/assets', 'dist/static/assets', { recursive: true });
if (fs.existsSync('public/uploads')) fs.cpSync('public/uploads', 'dist/static/uploads', { recursive: true, filter: source => path.basename(source) !== '.gitkeep' });
console.log('Vercel static assets ready. All page/API requests use api/index.ts.');
const preflight = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/firebase-prepare.ts'], { stdio: 'inherit', env: process.env });
if (preflight.status !== 0) process.exit(preflight.status || 1);
