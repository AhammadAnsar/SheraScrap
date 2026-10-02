import { build as viteBuild } from 'vite';
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import crypto from 'node:crypto';
import ts from 'typescript';
import { spawnSync } from 'node:child_process';

const config=ts.readConfigFile('tsconfig.json',ts.sys.readFile);
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,process.cwd());
const program=ts.createProgram(parsed.fileNames,parsed.options);
const diagnostics=ts.getPreEmitDiagnostics(program);
if(diagnostics.length)throw Error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>process.cwd(),getNewLine:()=> '\n'}));
fs.mkdirSync('.generated',{recursive:true});
fs.writeFileSync('.generated/styles.html',program.getSourceFiles().filter(f=>path.resolve(f.fileName).startsWith(path.resolve('src')+path.sep)).map(f=>f.text).join('\n')+'\n'+fs.readFileSync('content/site.json','utf8'));
await viteBuild({ configFile: 'vite.static.config.ts' });
// Bundle the same public components for build-time rendering, without CMS/auth/server code.
await build({
  entryPoints: ['scripts/render-pages.tsx'], outfile: 'dist/render-pages.mjs',
  bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
});
await import(pathToFileURL(path.resolve('dist/render-pages.mjs')).href + '?build=' + Date.now());
for (const folder of ['resources', 'uploads']) {
  const source = path.join('public', folder);
  if (fs.existsSync(source)) fs.cpSync(source, path.join('dist/pages', folder), {
    recursive: true, filter: file => path.basename(file) !== '.gitkeep',
  });
}
const search=JSON.parse(fs.readFileSync('content/search.json','utf8'));
fs.writeFileSync(path.join('dist/pages',search.indexNowKey+'.txt'),search.indexNowKey);
const fingerprint=crypto.createHash('sha256');
function hashDirectory(dir){for(const file of fs.readdirSync(dir).sort()){const name=path.join(dir,file);if(fs.statSync(name).isDirectory())hashDirectory(name);else{fingerprint.update(path.relative('dist/pages',name).split(path.sep).join('/'));fingerprint.update(fs.readFileSync(name));}}}
hashDirectory('dist/pages');
fs.writeFileSync('dist/pages/deployment.json',JSON.stringify({digest:fingerprint.digest('hex')}));
// Cloudflare Git builds run independently of GitHub Actions. Validate the
// actual artifact here too, so a broken content/image update cannot publish.
for(const args of [['node_modules/tsx/dist/cli.mjs','tests/pages.test.ts'],['tests/browser.test.mjs']]){
  const check=spawnSync(process.execPath,args,{stdio:'inherit'});
  if(check.error)throw check.error;
  if(check.status!==0)process.exit(check.status||1);
}
console.log('Static output: dist/pages. Cloudflare configuration included; no backend secrets required.');
