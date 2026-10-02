import React from 'react';
import type { LanguagePack } from '../types';
import LanguageSelector from './LanguageSelector';
import { areaHubPath, areaPath, featuredAreaSlugs, serviceAreas, type Lang } from '../content/serviceAreas';
import { useCMS } from '../static/CMSContext';
export default function Header({lang,setLang}: {lang:Lang;setLang:(lang:Lang)=>void;t:LanguagePack}) {
  const ar=lang==='ar', {cmsData}=useCMS(), s=cmsData.settings;
  const links=[
    {href:`/${lang}/`,en:'Home',ar:'الرئيسية'},
    {href:`/${lang}/#what-we-buy`,en:'What We Buy',ar:'ما نشتريه'},
    {href:`/${lang}/services/`,en:'Services',ar:'الخدمات'},
    {href:`/${lang}/pages/pricing/`,en:'Scrap Prices',ar:'الأسعار'},
    {href:`/${lang}/services/industrial-scrap/`,en:'Industrial',ar:'الصناعي'},
    {href:areaHubPath(lang),en:'Service Areas',ar:'مناطق الخدمة'},
    {href:`/${lang}/blog/`,en:'Blog',ar:'المقالات'},
    {href:`/${lang}/about/`,en:'About',ar:'من نحن'},
    {href:`/${lang}/contact/`,en:'Contact',ar:'تواصل'},
  ];
  return <header className="site-header" id="main-header">
    <div className="header-top"><div className="site-container"><span>{ar?'شراء المعادن والمعدات · الدمام والمنطقة الشرقية':'Metal & equipment buying · Dammam & Eastern Province'}</span><LanguageSelector lang={lang} setLang={setLang} variant="dark"/></div></div>
    <div className="site-container header-main">
      <a className="brand" href={`/${lang}/`}><img src="/resources/brand/sherascrap-logo.webp" width="54" height="54" alt={ar?'شعار شيرا سكراب':'SheraScrap logo'}/><span><strong>{ar?'شيرا سكراب':'SheraScrap'}</strong><small>{ar?'شراء المعادن والمعدات':'METALS & EQUIPMENT'}</small></span></a>
      <nav className="desktop-nav" aria-label={ar?'القائمة الرئيسية':'Main navigation'}>{links.map(l=>l.href===areaHubPath(lang)?<details key={l.href} className="nav-dropdown"><summary>{l[lang]}</summary><div>{featuredAreaSlugs.map(slug=>{const a=serviceAreas.find(a=>a.slug===slug)!;return <a key={slug} href={areaPath(a,lang)}>{a.name[lang]}</a>})}<a className="all-areas-link" href={l.href}>{ar?'جميع مناطق الخدمة':'All service areas'}</a></div></details>:<a key={l.href} href={l.href}>{l[lang]}</a>)}</nav>
      <a className="header-call" href={`tel:${s.phone}`}><span>{ar?'اتصل بنا':'Call us'}</span><bdi dir="ltr">057 369 0164</bdi></a>
      <details className="mobile-menu"><summary aria-label={ar?'القائمة':'Menu'}><span className="menu-label">{ar?'القائمة':'Menu'}</span><span aria-hidden="true">☰</span></summary><nav aria-label={ar?'قائمة الجوال':'Mobile navigation'}><a href={`/${lang}/`}>{ar?'الرئيسية':'Home'}</a>{links.map(l=><a key={l.href} href={l.href}>{l[lang]}</a>)}</nav></details>
    </div>
  </header>;
}



