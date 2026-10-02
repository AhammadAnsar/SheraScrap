import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
import { Window } from 'happy-dom';
const bundle=await build({entryPoints:['src/static/browser.ts'],bundle:true,format:'iife',write:false,loader:{'.css':'empty'}});
function load(route,origin='http://localhost'){
 const window=new Window({url:origin+route,settings:{disableJavaScriptFileLoading:true,disableCSSFileLoading:true}});
 window.document.write(fs.readFileSync('dist/pages'+route+'index.html','utf8'));
 // Happy DOM's streaming parser does not apply selected attributes like a
 // browser. Restore the HTML defaults; actual Chromium defaults are checked in UI QA.
 for(const select of window.document.querySelectorAll('select')){const selected=select.querySelector('option[selected]');if(selected)select.value=selected.value;}
 let navigated='';window.location.assign=url=>{navigated=url;};window.location.reload=()=>{};
 window.eval(bundle.outputFiles[0].text);
 return {window,doc:window.document,navigation:()=>navigated};
}
for(const [route,lang] of [['/en/service-areas/hafar-al-batin/','en'],['/ar/مناطق-الخدمة/حفر-الباطن/','ar']]){
 const {window,doc,navigation}=load(route),form=doc.querySelector('[data-quote-form]');
 assert.equal(form.querySelector('[name=area]').value,'hafar-al-batin');
 assert.equal(form.querySelector('[name=area]').options.length,24);
 assert.equal(form.querySelector('[data-share-photos]').hidden,true);
 assert.equal(doc.getElementById('analytics-consent').hidden,true,'Disable analytics on previews');
 const values={name:'Integration Test',phone:'0500000000',whatsapp:'0500000001',material:lang==='ar'?'سكراب النحاس':'Copper scrap',quantity:'125 kg & coils',message:'Test + details #1'};
 for(const [name,value] of Object.entries(values))form.querySelector(`[name=${name}]`).value=value;
 form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
 const url=new URL(navigation());assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/966573690164');
 const text=url.searchParams.get('text');for(const value of Object.values(values))assert(text.includes(value),'Lost form value: '+value);
 assert(text.includes(lang==='ar'?'حفر الباطن':'Hafar Al-Batin'));
 assert(text.includes(encodeURI(route)));
 const link=doc.querySelector('[data-language]');link.dispatchEvent(new window.Event('click'));assert(doc.cookie.includes('shera_lang='+(lang==='ar'?'en':'ar')));
 await window.happyDOM.close();
}
const {window,doc}=load('/en/','https://sherascrap.com');
assert.equal(doc.getElementById('analytics-consent').hidden,false);
assert(!doc.getElementById('shera-ga'),'No analytics before consent');
doc.querySelector('[data-analytics=no]').click();assert.equal(window.localStorage.getItem('shera_analytics'),'no');assert(!doc.getElementById('shera-ga'));
doc.querySelector('[data-analytics=yes]').click();assert.equal(window.localStorage.getItem('shera_analytics'),'yes');assert(doc.getElementById('shera-ga').src.includes('G-2DQ7V2XJ3E'));
const analytics=JSON.stringify(window.dataLayer);assert(!analytics.includes('0500000000'));assert(analytics.includes('page_view'));
await window.happyDOM.close();
console.log('PASS: shipped browser code opens both language enquiries with all form fields, correct area, cookie language preference and analytics consent; previews never load GA. No messages were sent.');
