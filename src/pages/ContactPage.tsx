import React from 'react';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import { LanguagePack } from '../types';

interface ContactPageProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function ContactPage({ lang, t }: ContactPageProps) {
  const isRtl = lang === 'ar';
  return (
    <>
      <SEO 
        title={isRtl ? "اتصل بنا | طلب معاينة وشراء سكراب" : "Contact Us | Scrap Inspection & Cash Payout"} 
        description={isRtl ? "تواصل مع مؤسسة شيرا لمعاينة السكراب والمعدات في الدمام والخبر والجبيل واستلام الكاش فورياً." : "Contact Shera Scrap for free on-site valuation across Dammam, Khobar, and Jubail with instant cash payment."} 
        canonicalPath={`/${lang}/contact/`}
        lang={lang}
      />
      <div className="pt-8">
        <ContactForm lang={lang} t={t} />
      </div>
    </>
  );
}
