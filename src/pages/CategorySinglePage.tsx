import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCMS } from '../static/CMSContext';
import { buyingCategories } from '../content/catalog';
import { areaHubPath,type Lang } from '../content/serviceAreas';
import { Process } from '../components/EditorialParts';
import QuoteRequest from '../static/QuoteRequest';
import NotFoundPage from './NotFoundPage';
export default function CategorySinglePage({lang}:{lang:Lang}){
 const {slug}=useParams(),{cmsData}=useCMS(),ar=lang==='ar';
 const c=cmsData.categories.find(c=>c.slug===slug),s=cmsData.services.find(s=>s.slug===slug&&s.active!==false),catalog=buyingCategories.find(c=>c.slug===slug);
 if(!c&&!s)return <NotFoundPage lang={lang}/>;
 const title=catalog?.title[lang]||(ar?c?.nameAr||s!.titleAr:c?.nameEn||s!.titleEn);
 const description=ar?(s as any)?.descriptionAr||c?.descriptionAr||s?.subtitleAr:(s as any)?.descriptionEn||c?.descriptionEn||s?.subtitleEn;
 const route=`/${lang}/services/${slug}/`;
 return <><SEO lang={lang} canonicalPath={route} title={`${title} | ${ar?'شراء سكراب الدمام':'Scrap Buying in Dammam'}`} description={description} image={`/resources/materials/${slug}.svg`} schema={{'@context':'https://schema.org','@type':'Service',name:title,serviceType:ar?'شراء السكراب والمعدات':'Scrap & equipment buying',url:'https://sherascrap.com'+route,provider:{'@id':'https://sherascrap.com/#organization'}}}/><div className="site-container page-heading"><nav className="breadcrumbs"><a href={`/${lang}/`}>{ar?'الرئيسية':'Home'}</a><span>/</span><a href={`/${lang}/services/`}>{ar?'الخدمات':'Services'}</a></nav><p className="eyebrow">{ar?'شراء السكراب في الدمام':'SCRAP BUYING IN DAMMAM'}</p><h1>{title}</h1><p className="page-intro">{description}</p></div><div className="site-container content-prose"><img src={`/resources/materials/${slug}.svg`} width="480" height="280" alt={ar?`رسم توضيحي: ${title}`:`Illustration: ${title}`}/><h2>{ar?'تجهيز المادة للتقييم':'Prepare the material for assessment'}</h2><p>{catalog?.description[lang]||description}</p><ul><li>{ar?'أرسل صوراً عامة وتفاصيل واضحة للحالة ونوع المادة.':'Send overview photos and clear details of condition and material type.'}</li><li>{ar?'حدد الوزن التقريبي أو عدد القطع، مع فصل المواد المختلفة إن أمكن.':'Provide approximate weight or item count, keeping different materials separate where practical.'}</li><li>{ar?'وضح موقع الاستلام وإمكانية دخول المركبة وأي متطلبات للفك أو الرفع.':'Describe collection access and any dismantling or lifting needs.'}</li></ul><h2>{ar?'كيف يحدد عرض الشراء؟':'How is the buying offer decided?'}</h2><p>{ar?'تختلف القيمة حسب درجة المادة ونقاوتها وحالتها والوزن ومتطلبات المناولة. الصور تساعد على التقييم الأولي؛ السعر النهائي وشروط الاستلام والدفع تحدد بعد المراجعة.':'Value varies with grade, purity, condition, weight and handling requirements. Photos support an initial review; final price, collection and payment terms follow assessment.'}</p><a href={`/${lang}/pages/pricing/`}>{ar?'دليل التسعير':'Pricing guide'}</a> · <a href={areaHubPath(lang)}>{ar?'مناطق الاستلام':'Collection areas'}</a><h2>{ar?'خطوات البيع والاستلام':'Selling & collection steps'}</h2><Process lang={lang}/></div><QuoteRequest lang={lang}/></>;
}
