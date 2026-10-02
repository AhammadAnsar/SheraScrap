import fs from 'node:fs';
const {host,indexNowKey:key}=JSON.parse(fs.readFileSync('content/search.json','utf8'));
const origin='https://'+host;
const urlList=[...fs.readFileSync('dist/pages/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const body={host,key,keyLocation:`${origin}/${key}.txt`,urlList};
if(!process.argv.includes('--submit')){console.log(`IndexNow ready: ${urlList.length} URLs. No submission during local builds.`);process.exit(0);}
const digest=JSON.parse(fs.readFileSync('dist/pages/deployment.json','utf8')).digest;
let ready=false;
for(let attempt=0;attempt<20;attempt++){
 try{const marker=await fetch(`${origin}/deployment.json?verify=${digest}`,{signal:AbortSignal.timeout(10000),cache:'no-store'});const keyFile=await fetch(body.keyLocation,{signal:AbortSignal.timeout(10000)});ready=marker.ok&&(await marker.json()).digest===digest&&keyFile.ok&&(await keyFile.text()).trim()===key;}catch{/* Wait until Cloudflare publishes this exact build. */}
 if(ready)break;await new Promise(resolve=>setTimeout(resolve,15000));
}
if(!ready){console.log('IndexNow pending: this build is not yet live on the production domain. Retry the workflow after deployment.');process.exit(0);}
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
if(![200,202].includes(response.status))throw Error('IndexNow response: '+response.status);
console.log(`IndexNow accepted ${urlList.length} URLs (${response.status}). Indexing remains the search engine’s decision.`);
