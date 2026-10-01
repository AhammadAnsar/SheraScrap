import React from 'react';
import SEO from '../components/SEO';
import ScrapEstimator from '../static/QuoteRequest';
import { LanguagePack } from '../types';

interface EstimatorPageProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function EstimatorPage({ lang, t }: EstimatorPageProps) {
  const isRtl = lang === 'ar';
  return (
    <>
      <SEO 
        title={isRtl ? 'طلب تسعير السكراب بالدمام عبر واتساب' : 'Request a Scrap Quote in Dammam on WhatsApp'}
        description={isRtl ? 'أرسل تفاصيل النحاس والحديد والمكيفات لفريق شيرا عبر واتساب. السعر النهائي بعد الفحص والوزن.' : 'Send your copper, iron or AC scrap details to Shera Scrap on WhatsApp. Final prices follow inspection and weighing.'}
        canonicalPath={`/${lang}/estimator/`}
        lang={lang}
      />
      <div className="pt-8">
        <h1 className="text-3xl font-black text-center px-4 pt-8">{isRtl ? 'طلب تسعير السكراب' : 'Get a Scrap Quote'}</h1>
        <ScrapEstimator lang={lang} t={t} />
      </div>
    </>
  );
}
