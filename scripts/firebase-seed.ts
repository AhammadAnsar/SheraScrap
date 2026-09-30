import 'dotenv/config';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { adminApp, storeCollection, mediaBucket } from '../src/server/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';

// Explicit operator action only. Never seed from a web request or overwrite live data.
const email = process.argv[2];
if (!email || !email.includes('@')) throw new Error('Usage: npm run firebase:seed -- verified-admin@example.com');
const account = await getAuth(adminApp()).getUserByEmail(email);
if (account.disabled) throw new Error('Admin must be an enabled Firebase user.');
if (!account.emailVerified) console.log('Admin email awaits verification. CMS login remains blocked until the user verifies their email.');
const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
store.users = [{ id: account.uid, email: account.email, username: email.split('@')[0], name: account.displayName || email.split('@')[0], role: 'super_admin', createdAt: new Date().toISOString() }];
store.inquiries = [];
store.auditLogs = [];
if (store.content) {
  for (const key of ['users', 'inquiries', 'auditLogs', 'searchLogs']) delete store.content[key];
}
const collection = storeCollection();
if (!process.argv.includes('--media-only')) await collection.firestore.runTransaction(async tx => {
  const existing = await tx.get(collection);
  if (!existing.empty) throw new Error('CMS already exists. Seed refused to protect existing data.');
  for (const [key, value] of Object.entries(store)) {
    if (Buffer.byteLength(JSON.stringify(value)) > 900_000) throw new Error(`Section ${key} is too large`);
    tx.create(collection.doc(key), { value });
  }
});
console.log('CMS initialization complete/skipped; legacy collections are unchanged.');
// Upload packaged media without overwriting existing Storage objects.
if (fs.existsSync('public/uploads')) {
  for (const name of fs.readdirSync('public/uploads')) {
    if (!/\.(png|jpe?g|webp)$/i.test(name)) continue;
    const file = mediaBucket().file('uploads/' + name);
    const [exists] = await file.exists();
    if (exists) continue;
    const ext = name.split('.').pop()!.toLowerCase();
    await file.save(fs.readFileSync('public/uploads/' + name), { resumable: false, metadata: { contentType: 'image/' + (ext === 'jpg' ? 'jpeg' : ext), metadata: { firebaseStorageDownloadTokens: randomUUID() } } });
  }
}
console.log('Media upload complete. Configure the same credentials and database ID in Vercel.');
