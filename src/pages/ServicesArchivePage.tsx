import React from 'react';
import SEO from '../components/SEO';
import Services from '../components/Services';
import { LanguagePack } from '../types';

interface ServicesArchivePageProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function ServicesArchivePage({ lang, t }: ServicesArchivePageProps) {
  const isRtl = lang === 'ar';
  return (
    <>
      <SEO 
        title={isRtl ? "خدماتنا | شراء السكراب والمعادن بالدمام" : "Our Services | Metal Scrap & Equipment Purchasing"} 
        description={isRtl ? "تصفح جميع خدماتنا في مجال شراء السكراب، النحاس، الحديد، الألمنيوم، ومعدات المطاعم والمكيفات بالشرقية." : "Browse our full range of scrap purchasing services: copper, iron, AC units, restaurant equipment and cables."} 
        canonicalPath={`/${lang}/services/`}
        lang={lang}
      />
      <div className="pt-8">
        <Services lang={lang} t={t} />
      </div>
    </>
  );
}
