import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const target = path.resolve(root, 'dist');
if (path.dirname(target) !== root || path.basename(target) !== 'dist') throw new Error('Unsafe build directory');
fs.rmSync(target, { recursive: true, force: true });
