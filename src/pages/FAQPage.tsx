import React from 'react';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';
import { LanguagePack } from '../types';

interface FAQPageProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function FAQPage({ lang, t }: FAQPageProps) {
  const isRtl = lang === 'ar';
  return (
    <>
      <SEO 
        title={isRtl ? "الأسئلة الشائعة | أسئلة بيع السكراب والمعادن" : "FAQ | Frequently Asked Scrap Selling Questions"} 
        description={isRtl ? "إجابات شاملة عن كيفية بيع السكراب، موازين التثمين، النقل والتحميل المجاني، والدفع الكاش الفوري بالدمام." : "Clear answers about selling scrap, calibrated digital scales, free trucking, and instant cash payouts."} 
        canonicalPath={`/${lang}/faq/`}
        lang={lang}
      />
      <div className="pt-8">
        <h1 className="text-3xl font-black text-center px-4 pt-8">{isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h1>
        <FAQ lang={lang} t={t} />
      </div>
    </>
  );
}
