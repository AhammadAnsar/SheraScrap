import React from 'react';
import SEO from '../components/SEO';
import WhyChooseUs from '../components/WhyChooseUs';
import OurStrength from '../components/OurStrength';
import TrustStats from '../components/TrustStats';
import { LanguagePack } from '../types';

interface AboutPageProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function AboutPage({ lang, t }: AboutPageProps) {
  const isRtl = lang === 'ar';
  return (
    <>
      <SEO 
        title={isRtl ? "من نحن | مؤسسة شيرا لشراء السكراب" : "About Us | Shera Scrap Purchasing"} 
        description={isRtl ? "تعرف على مؤسسة شيرا وتخصصنا في شراء السكراب والمعادن ومعدات المطاعم بالدمام والشرقية." : "Learn about Shera Scrap and our metal recycling and equipment buying expertise in Dammam."} 
        canonicalPath={`/${lang}/about/`}
        lang={lang}
      />
      <div className="pt-8">
        <OurStrength lang={lang} t={t} />
        <TrustStats lang={lang} t={t} />
        <WhyChooseUs lang={lang} t={t} />
      </div>
    </>
  );
}
