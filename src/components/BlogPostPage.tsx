import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from './SEO';
import { useCMS } from '../static/CMSContext';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { isContentPublished } from '../utils/publication';
import type { Lang } from '../content/serviceAreas';
import type { LanguagePack } from '../types';
import NotFoundPage from '../pages/NotFoundPage';
export default function BlogPostPage({lang}:{lang:Lang;setLang:(lang:Lang)=>void;t:LanguagePack}){
 const {slug}=useParams(),{cmsData}=useCMS(),ar=lang==='ar',p=cmsData.posts.find(p=>p.slug===slug||p.id===slug);
 if(!p||!isContentPublished(p))return <NotFoundPage lang={lang}/>;
 const title=ar?p.titleAr:p.titleEn,description=ar?p.excerptAr:p.excerptEn,url='https://sherascrap.com'+`/${lang}/blog/${p.slug}/`;
 const date=p.date?new Date(p.date):null,modified=(p as any).updatedAt;
 const related=cmsData.posts.filter(x=>x.slug!==p.slug).slice(0,3);
 return <><SEO lang={lang} title={title} description={description} canonicalPath={`/${lang}/blog/${p.slug}/`} image={p.featuredImage} type="article" schema={[{'@context':'https://schema.org','@type':'Article',headline:title,description,url,mainEntityOfPage:url,inLanguage:ar?'ar-SA':'en-SA',author:{'@type':'Organization','@id':'https://sherascrap.com/#organization',name:ar?'شيرا سكراب':'SheraScrap',url:'https://sherascrap.com'+`/${lang}/about/`},publisher:{'@id':'https://sherascrap.com/#organization'},...(date&&!isNaN(date.getTime())?{datePublished:date.toISOString()}:{}),...(modified?{dateModified:new Date(modified).toISOString()}:{}),...(p.featuredImage?{image:'https://sherascrap.com'+p.featuredImage}:{})},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:ar?'الرئيسية':'Home',item:`https://sherascrap.com/${lang}/`},{'@type':'ListItem',position:2,name:ar?'أدلة البيع':'Selling guides',item:`https://sherascrap.com/${lang}/blog/`},{'@type':'ListItem',position:3,name:title,item:url}]}]}/><article className="site-container content-prose page-heading"><nav className="breadcrumbs"><a href={`/${lang}/`}>{ar?'الرئيسية':'Home'}</a><span>/</span><a href={`/${lang}/blog/`}>{ar?'أدلة البيع':'Selling guides'}</a></nav><p className="eyebrow">{ar?'دليل شيرا سكراب':'SHERASCRAP GUIDE'}</p><h1>{title}</h1><p className="page-intro">{description}</p><p className="form-help">{ar?'إعداد: شيرا سكراب':'By SheraScrap'} · {date&&!isNaN(date.getTime())&&<time dateTime={p.date}>{new Intl.DateTimeFormat(ar?'ar-SA':'en-SA',{dateStyle:'long',timeZone:'UTC'}).format(date)}</time>}</p>{p.featuredImage&&<img src={p.featuredImage} width="850" height="400" alt={ar?'صورة توضيحية لموضوع الدليل':'Illustration of the guide topic'} style={{width:'100%',height:300,objectFit:'cover',marginBlock:25}}/>}<div dangerouslySetInnerHTML={{__html:sanitizeHtml(ar?p.contentAr:p.contentEn)}}/><h2>{ar?'أدلة ذات صلة':'Related guides'}</h2><ul>{related.map(r=><li key={r.id}><a href={`/${lang}/blog/${r.slug}/`}>{ar?r.titleAr:r.titleEn}</a></li>)}</ul><a className="button button-dark" href={`/${lang}/contact/`}>{ar?'ناقش الكمية مع الفريق':'Discuss your lot with the team'}</a></article></>;
}
