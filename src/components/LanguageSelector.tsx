import React from 'react';
import { useLocation } from 'react-router-dom';
import { languageCounterpart, type Lang } from '../content/serviceAreas';
export default function LanguageSelector({lang}:{lang:Lang;setLang:(lang:Lang)=>void;variant?:'light'|'dark'}) {
 const target=lang==='ar'?'en':'ar',path=useLocation().pathname;
 return <a id="lang-selector-btn" className="language-link" lang={target} hrefLang={target} data-language={target} href={languageCounterpart(path.endsWith('/')?path:path+'/',target)}>{target==='en'?'English':'العربية'} <span aria-hidden="true">↔</span></a>;
}
