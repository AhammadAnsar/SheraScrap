import '../index.css';
import { whatsappUrl } from '../utils/whatsapp';
const ar=document.documentElement.lang==='ar';
const t=(en:string,arabic:string)=>ar?arabic:en;
for(const link of document.querySelectorAll<HTMLAnchorElement>('[data-language]'))link.addEventListener('click',()=>{document.cookie=`shera_lang=${link.dataset.language}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;});
export function prepareQuote(form:HTMLFormElement):string {
 const d=new FormData(form),area=form.querySelector<HTMLSelectElement>('select[name=area]')!;
 return t('Scrap buying enquiry','طلب شراء سكراب')+'\n'+[
  [t('Name','الاسم'),d.get('name')],[t('Phone','الهاتف'),d.get('phone')],[t('WhatsApp','واتساب'),d.get('whatsapp')||d.get('phone')],
  [t('Material','المادة'),d.get('material')],[t('Approximate quantity','الكمية التقريبية'),d.get('quantity')],[t('Service area','منطقة الخدمة'),area.selectedOptions[0].text],
  [t('Details','التفاصيل'),d.get('message')],
 ].filter(([,value])=>value).map(([label,value])=>label+': '+value).join('\n')+'\n'+location.origin+location.pathname;
}
for(const form of document.querySelectorAll<HTMLFormElement>('[data-quote-form]')){
 const input=form.querySelector<HTMLInputElement>('[data-quote-photos]')!,error=form.querySelector<HTMLElement>('[data-quote-error]')!,names=form.querySelector<HTMLElement>('[data-selected-photos]')!,share=form.querySelector<HTMLButtonElement>('[data-share-photos]')!;
 let files:File[]=[];
 const fail=(message:string)=>{error.textContent=message;error.hidden=!message;};
 input.addEventListener('change',()=>{
  files=Array.from(input.files||[]);fail('');
  if(files.length>6||files.some(f=>f.size>8*1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type))){files=[];input.value='';fail(t('Choose up to 6 JPEG, PNG or WebP photos under 8 MB each.','اختر حتى ٦ صور بصيغة JPEG أو PNG أو WebP، كل صورة أقل من ٨ ميغابايت.'));}
  names.hidden=!files.length;names.textContent=files.map(f=>f.name).join(' · ');share.hidden=!files.length||!navigator.canShare?.({files});
 });
 share.addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.share({files,text:prepareQuote(form)});}catch(e){if((e as Error).name!=='AbortError')fail(t('Attach photos directly in WhatsApp.','أرفق الصور مباشرة في واتساب.'));}});
 form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity())location.assign(whatsappUrl(form.dataset.whatsapp!,prepareQuote(form)));});
}
const banner=document.getElementById('analytics-consent');
const production=['sherascrap.com','www.sherascrap.com'].includes(location.hostname);
function analyticsChoice(){let choice:string|null='no';try{choice=localStorage.getItem('shera_analytics');}catch{/* Unavailable storage leaves analytics disabled. */}if(banner)banner.hidden=!production||choice!==null;if(production&&choice==='yes'&&!document.getElementById('shera-ga')){
 const w=window as unknown as {dataLayer:unknown[]};w.dataLayer=w.dataLayer||[];
 // Google processes the arguments object expected by its standard gtag snippet.
 function gtag(..._args:unknown[]){w.dataLayer.push(arguments);}
 gtag('js',new Date());gtag('config','G-2DQ7V2XJ3E',{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
 gtag('event','page_view',{page_location:location.origin+location.pathname,page_title:document.title,page_referrer:document.referrer?new URL(document.referrer).origin:''});
 const script=document.createElement('script');script.id='shera-ga';script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=G-2DQ7V2XJ3E';document.head.append(script);
}}
analyticsChoice();for(const button of document.querySelectorAll<HTMLButtonElement>('[data-analytics]'))button.addEventListener('click',()=>{try{localStorage.setItem('shera_analytics',button.dataset.analytics!);}catch{}analyticsChoice();if(banner)banner.hidden=true;});
document.querySelector('[data-analytics-reset]')?.addEventListener('click',()=>{try{localStorage.removeItem('shera_analytics');}catch{}location.reload();});
