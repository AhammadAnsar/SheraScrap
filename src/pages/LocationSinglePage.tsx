import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCMS } from '../static/CMSContext';
import { areaHubPath,areaPath,serviceAreas,type Lang } from '../content/serviceAreas';
import { Process } from '../components/EditorialParts';
import QuoteRequest from '../static/QuoteRequest';
import NotFoundPage from './NotFoundPage';
import { isContentPublished } from '../utils/publication';
export default function LocationSinglePage({lang}:{lang:Lang}){
 const {slug}=useParams(),{cmsData}=useCMS(),ar=lang==='ar',item=cmsData.locations?.find(l=>l.slug===slug&&isContentPublished(l));
 if(!item)return <NotFoundPage lang={lang}/>;
 const title=ar?item.titleAr:item.titleEn,description=ar?item.metaDescriptionAr:item.metaDescriptionEn,area=serviceAreas.find(a=>a.name.ar===item.cityAr);
 return <><SEO title={title} description={description} lang={lang} canonicalPath={`/${lang}/locations/${slug}/`} schema={{'@context':'https://schema.org','@type':'Service',name:title,provider:{'@id':'https://sherascrap.com/#organization'},areaServed:{'@type':'Place',name:ar?item.cityAr:item.cityEn},url:`https://sherascrap.com/${lang}/locations/${slug}/`}}/><div className="site-container page-heading"><nav className="breadcrumbs"><a href={`/${lang}/`}>{ar?'الرئيسية':'Home'}</a><span>/</span><a href={`/${lang}/locations/`}>{ar?'أدلة الخدمة المحلية':'Local service guides'}</a></nav><p className="eyebrow">{ar?'الخدمة حسب نوع الكمية':'SERVICE FOR YOUR LOT'}</p><h1>{title}</h1><p className="page-intro">{description}</p></div><section className="site-container content-prose"><h2>{ar?'معلومات مهمة لتجهيز الطلب':'Prepare your enquiry'}</h2><p>{ar?item.contentAr:item.contentEn}</p><h2>{ar?'المعاينة والاستلام':'Assessment & collection'}</h2><Process lang={lang}/><h2>{ar?'توضيح القيمة والنطاق':'Clarify value & scope'}</h2><p>{ar?'قدم العدد أو الوزن التقريبي والحالة ومتطلبات الدخول. يناقش الفريق قبول المواد والقياس والدفع وترتيبات النقل قبل تأكيد الطلب.':'Provide item count or approximate weight, condition and access requirements. The team discusses acceptance, measurement, payment and transport arrangements before confirming your enquiry.'}</p><a href={`/${lang}/pages/pricing/`}>{ar?'دليل التسعير':'Pricing guide'}</a> · <a href={area?areaPath(area,lang):areaHubPath(lang)}>{ar?'الخدمة في منطقتك':'Service in your area'}</a></section><QuoteRequest lang={lang} areaSlug={area?.slug}/></>;
}
