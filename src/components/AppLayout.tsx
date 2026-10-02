import React from 'react';
import Header from './Header';
import type { LanguagePack } from '../types';
import { useCMS } from '../static/CMSContext';
import { serviceAreas, featuredAreaSlugs, areaHubPath, areaPath, type Lang } from '../content/serviceAreas';
import { SITE_CONFIG } from '../config/site';
import { whatsappUrl } from '../utils/whatsapp';
import AnalyticsConsent from './AnalyticsConsent';
export default function AppLayout({children,lang,setLang,t}: {children:React.ReactNode;lang:Lang;setLang:(l:Lang)=>void;t:LanguagePack}) {
 const ar=lang==='ar',{cmsData}=useCMS(),s=cmsData.settings;
 const wa=whatsappUrl(s.whatsapp,ar?'السلام عليكم، أريد الاستفسار عن شراء السكراب.':'Hello, I would like to enquire about scrap buying.');
 return <div className="site-shell"><a className="skip-link" href="#main-content">{ar?'انتقل إلى المحتوى':'Skip to content'}</a><Header lang={lang} setLang={setLang} t={t}/><main id="main-content">{children}</main>
 <footer className="site-footer"><div className="site-container footer-grid">
   <div className="footer-brand"><a href={`/${lang}/`} className="brand"><img src="/resources/brand/sherascrap-logo.webp" width="54" height="54" loading="lazy" alt={ar?'شعار شيرا سكراب':'SheraScrap logo'}/><strong>{ar?'شيرا سكراب':'SheraScrap'}</strong></a><p>{ar?'شراء السكراب والمعادن والمعدات المستعملة المختارة في الدمام ومناطق خدمتنا في الشرقية.':'Scrap metal and selected used equipment buying in Dammam and our covered Eastern Province locations.'}</p><a href={`tel:${s.phone}`}><bdi dir="ltr">+966 57 369 0164</bdi></a><a href={`mailto:${s.email}`}>{s.email}</a><p>{ar?s.locationAr:s.locationEn}</p></div>
   <nav aria-label={ar?'روابط الخدمات':'Service links'}><h2>{ar?'استكشف خدماتنا':'Explore our services'}</h2>{[['services/',ar?'المعادن والمعدات':'Metals & equipment'],['services/industrial-scrap/',ar?'السكراب الصناعي':'Industrial scrap'],['pages/pricing/',ar?'دليل التسعير':'Pricing guide'],['blog/',ar?'أدلة البيع':'Selling guides'],['about/',ar?'من نحن':'About SheraScrap'],['contact/',ar?'تواصل معنا':'Contact us'],['faq/',ar?'الأسئلة الشائعة':'Common questions'],['estimator/',ar?'طلب تسعير':'Request a quote'],['privacy/',ar?'سياسة الخصوصية':'Privacy policy']].map(([p,label])=><a key={p} href={`/${lang}/${p}`}>{label}</a>)}</nav>
   <nav aria-label={ar?'مناطق الخدمة':'Service areas'}><h2>{ar?'مناطق الخدمة':'Service areas'}</h2>{featuredAreaSlugs.map(slug=>{const a=serviceAreas.find(a=>a.slug===slug)!;return <a key={slug} href={areaPath(a,lang)}>{a.name[lang]}</a>})}<a className="footer-all" href={areaHubPath(lang)}>{ar?'عرض جميع مناطق الخدمة':'View all service areas'}</a></nav>
   <div><h2>{ar?'ابدأ بتفاصيل بسيطة':'Start with a few details'}</h2><p>{ar?'أرسل نوع المادة والكمية ومنطقة الاستلام، وأرفق الصور في واتساب.':'Send the material, quantity and collection area, then attach your photos in WhatsApp.'}</p><a className="button button-green" href={wa}>{ar?'تواصل عبر واتساب':'Chat on WhatsApp'}</a><div className="social-links">{Object.entries(SITE_CONFIG.social).map(([name,url])=><a href={url} key={name} target="_blank" rel="noopener noreferrer">{ar?({facebook:'فيسبوك',youtube:'يوتيوب',instagram:'إنستغرام',tiktok:'تيك توك',snapchat:'سناب شات'} as Record<string,string>)[name]:name.charAt(0).toUpperCase()+name.slice(1)}</a>)}</div></div>
 </div><div className="site-container footer-bottom"><span>{ar?'© ٢٠٢٦ شيرا سكراب. جميع الحقوق محفوظة.':'© 2026 SheraScrap. All rights reserved.'}</span><a href={`/${lang}/privacy/`}>{ar?'الخصوصية':'Privacy'}</a></div></footer>
 <div className="mobile-contact"><a href={wa}>{ar?'تواصل واتساب':'WhatsApp us'}</a><a href={`tel:${s.phone}`}>{ar?'اتصل بالفريق':'Call our team'}</a></div><AnalyticsConsent lang={lang}/></div>;
}



