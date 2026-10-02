import React from 'react';
import { words, type Lang, type Localized } from '../content/serviceAreas';
import { homeFaqs } from '../content/catalog';
import { serializeJson } from '../utils/serialize';
export function SectionHeading({eyebrow,title,text}: {eyebrow?:string;title:string;text?:string}) {
  return <div className="section-heading">{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{text&&<p>{text}</p>}</div>;
}
export function Process({lang}: {lang:Lang}) {
  const steps = [
    {title:words('Show us the lot','عرّفنا بالكمية'),text:words('Send photos, the material type, approximate quantity and your service area.','أرسل الصور ونوع المادة والكمية التقريبية ومنطقة الخدمة.')},
    {title:words('Agree the assessment','اتفق على التقييم'),text:words('We discuss condition, access, inspection and the collection requirements.','نناقش الحالة والدخول والمعاينة ومتطلبات الاستلام.')},
    {title:words('Confirm & collect','أكد تفاصيل الاستلام'),text:words('Confirm the price, measurement and payment terms before loading.','أكد السعر والقياس وشروط الدفع قبل التحميل.')},
  ];
  return <ol className="process-grid">{steps.map((s,i)=><li key={i}><span className="step-number">{new Intl.NumberFormat(lang==='ar'?'ar-SA':'en-SA',{minimumIntegerDigits:2}).format(i+1)}</span><h3>{s.title[lang]}</h3><p>{s.text[lang]}</p></li>)}</ol>;
}
export function FAQs({lang,items=homeFaqs}: {lang:Lang;items?:{q:Localized;a:Localized}[]}) {
  return <><div className="editorial-faq">{items.map((f,i)=><details key={i}><summary>{f.q[lang]}</summary><p>{f.a[lang]}</p></details>)}</div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJson({'@context':'https://schema.org','@type':'FAQPage',mainEntity:items.map(f=>({'@type':'Question',name:f.q[lang],acceptedAnswer:{'@type':'Answer',text:f.a[lang]}}))})}}/></>;
}
