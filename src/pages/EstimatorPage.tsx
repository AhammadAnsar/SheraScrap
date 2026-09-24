import React from 'react';
import SEO from '../components/SEO';
import ScrapEstimator from '../components/ScrapEstimator';
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
        title={isRtl ? "حاسبة أسعار السكراب | تسعير فوري بالدمام" : "Scrap Price Calculator | Instant Valuation Dammam"} 
        description={isRtl ? "احسب القيمة التقديرية لسكراب النحاس والحديد والمكيفات بالدمام طبقاً لأسعار السوق اليوم." : "Calculate instant estimates for your copper, iron, AC, and metal scrap based on today's market rates."} 
        canonicalPath={`/${lang}/estimator/`}
        lang={lang}
      />
      <div className="pt-8">
        <ScrapEstimator lang={lang} t={t} />
      </div>
    </>
  );
}
