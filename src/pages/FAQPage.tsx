import React from 'react';
import SEO from '../components/SEO';
import { FAQs } from '../components/EditorialParts';
import type { Lang } from '../content/serviceAreas';
import type { LanguagePack } from '../types';
export default function FAQPage({lang}:{lang:Lang;t:LanguagePack}) {const ar=lang==='ar';return <><SEO lang={lang} canonicalPath={`/${lang}/faq/`} title={ar?'الأسئلة الشائعة عن بيع السكراب':'Frequently Asked Scrap Selling Questions'} description={ar?'إجابات عن تقييم السكراب وتجهيز الكمية وتنسيق الاستلام والتواصل عبر واتساب مع شيرا سكراب في الدمام.':'Answers about scrap assessment, preparation, collection arrangements and WhatsApp enquiries with SheraScrap in Dammam.'}/><div className="site-container page-heading"><h1>{ar?'أسئلة قبل بيع السكراب':'Questions before selling scrap'}</h1></div><section className="site-container content-prose"><FAQs lang={lang}/></section></>}
