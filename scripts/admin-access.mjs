// Run locally on the server to authorize an existing verified Firebase user.
// This does not create a Firebase account or change its password.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import 'dotenv/config';
const [emailInput, name = 'Site administrator'] = process.argv.slice(2);
const email = emailInput?.trim().toLowerCase();
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error('Usage: node scripts/admin-access.mjs admin@example.com "Name"');
  process.exit(1);
}
const file = path.resolve(process.env.DATA_DIR || './data', 'store.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
fs.copyFileSync(file, file + '.backup-' + Date.now());
const existing = data.users.find(user => user.email?.toLowerCase() === email);
if (existing) existing.role = 'super_admin';
else data.users.push({ id: crypto.randomUUID(), email, name, username: email, role: 'super_admin', createdAt: new Date().toISOString() });
fs.writeFileSync(file + '.tmp', JSON.stringify(data, null, 2));
fs.renameSync(file + '.tmp', file);
console.log('CMS access saved. Restart the server to reload its user registry. Firebase account creation and email verification are separate steps.');
