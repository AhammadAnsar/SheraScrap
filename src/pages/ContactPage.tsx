import React from 'react';
import SEO from '../components/SEO';
import QuoteRequest from '../static/QuoteRequest';
import { useCMS } from '../static/CMSContext';
import type { Lang } from '../content/serviceAreas';
import type { LanguagePack } from '../types';
export default function ContactPage({lang}:{lang:Lang;t:LanguagePack}) {
 const ar=lang==='ar',{cmsData}=useCMS(),s=cmsData.settings;
 return <><SEO lang={lang} canonicalPath={`/${lang}/contact/`} title={ar?'تواصل معنا | تقييم وشراء السكراب':'Contact Us | Scrap Assessment & Buying'} description={ar?'تواصل مع شيرا سكراب في الدمام عبر الهاتف أو واتساب. قدم نوع المادة والكمية ومنطقة الاستلام لمناقشة التقييم والترتيبات.':'Contact SheraScrap in Dammam by phone or WhatsApp. Share material, quantity and collection area to discuss assessment and arrangements.'}/><div className="site-container page-heading"><p className="eyebrow">{ar?'تواصل مباشر':'DIRECT CONTACT'}</p><h1>{ar?'لنتحدث عن سكرابك':'Let’s talk about your scrap'}</h1><p className="page-intro">{ar?'أرسل تفاصيل الكمية والصور في واتساب، أو اتصل بالفريق لمناقشة الطلب. نؤكد السعر ومتطلبات الاستلام بعد المراجعة.':'Send details and photos on WhatsApp, or call the team to discuss your enquiry. We confirm price and collection requirements after reviewing the lot.'}</p></div><div className="site-container contact-facts"><a href={`tel:${s.phone}`}><bdi dir="ltr">+966 57 369 0164</bdi></a><a href={`mailto:${s.email}`}>{s.email}</a><p>{ar?s.locationAr:s.locationEn}</p></div><QuoteRequest lang={lang}/></>;
}
