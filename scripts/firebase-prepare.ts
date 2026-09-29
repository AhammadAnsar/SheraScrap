import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { storeCollection, mediaBucket } from '../src/server/firebaseAdmin';

if (!process.env.VERCEL) {
  console.log('Local build: Firebase deployment preflight skipped (no Vercel credentials assumed).');
  process.exit(0);
}
if (!process.env.PREVIEW_SECRET || process.env.PREVIEW_SECRET.length < 32) throw new Error('Set PREVIEW_SECRET to a stable random secret of at least 32 characters in Vercel.');
const collection = storeCollection();
// Verify both services before attempting any initialization.
await mediaBucket().getFiles({ maxResults: 1 });
let snapshot = await collection.get();
if (snapshot.empty) {
  const email = process.env.CMS_BOOTSTRAP_ADMIN_EMAIL;
  if (!email) throw new Error('CMS is empty. Set CMS_BOOTSTRAP_ADMIN_EMAIL to an enabled, verified Firebase user, then redeploy (or run firebase:seed locally).');
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/firebase-seed.ts', email], { stdio: 'inherit', env: process.env });
  if (result.status !== 0) process.exit(result.status || 1);
  snapshot = await collection.get();
}
const data = Object.fromEntries(snapshot.docs.map(doc => [doc.id, doc.data().value]));
if (!data.version || !data.settings || !Array.isArray(data.users) || !data.users.some((u: any) => u.role === 'super_admin')) throw new Error('CMS is incomplete or has no super admin; inspect Firebase before deploying.');
console.log('Firebase preflight passed: CMS exists, super admin configured, Storage reachable.');
