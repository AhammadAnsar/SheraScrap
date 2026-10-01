import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';

const root = process.cwd();
const stage = path.resolve(process.argv[2] || '');
if (!process.argv[2] || !stage.startsWith(path.join(root, 'release') + path.sep)) throw Error('Stage must be inside release');
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
if (config.error) throw Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) throw Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCanonicalFileName: f => f, getCurrentDirectory: () => root, getNewLine: () => '\n',
}));
const files = new Set([
  'package.json', 'package-lock.json', 'tsconfig.json', 'vite.static.config.ts', 'index.html',
  '.gitignore', '.node-version', '.nvmrc', 'wrangler.jsonc', '.github/workflows/validate.yml',
  'CLOUDFLARE-PAGES.md', 'STATIC-VALIDATION.md', 'src/index.css',
  'scripts/build-pages.mjs', 'scripts/render-pages.tsx', 'scripts/preview-pages.mjs', 'scripts/clean.mjs',
  'scripts/package-pages.ps1', 'scripts/stage-release.mjs', 'tests/pages.test.ts', 'tests/cloudflare.test.mjs',
]);
// Include type-only imports as well as browser source. Never ship obsolete
// backend/admin modules or require files from the previous repository.
for (const file of program.getSourceFiles()) {
  const relative = path.relative(root, path.resolve(file.fileName)).split(path.sep).join('/');
  if (relative.startsWith('src/') && !relative.includes('node_modules/')) files.add(relative);
}
function collect(folder) {
  if (!fs.existsSync(folder)) return;
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (entry.name !== '.gitkeep') files.add(file.split(path.sep).join('/'));
  }
}
collect('content'); collect('public/resources'); collect('public/uploads');
fs.mkdirSync(stage, { recursive: true });
for (const relative of files) {
  const target = path.join(stage, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, relative), target);
}
fs.copyFileSync('CLOUDFLARE-PAGES.md', path.join(stage, 'README.md')); files.add('README.md');
const manifest = [...files].sort().map(file => ({ file, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(stage, file))).digest('hex') }));
fs.writeFileSync(path.join(stage, 'RELEASE-MANIFEST.json'), JSON.stringify({ files: manifest }, null, 2) + '\n');
console.log(`Staged ${files.size} complete repository files with SHA-256 manifest.`);
