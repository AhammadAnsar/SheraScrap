import React from 'react';
import HeroSlider from '../components/HeroSlider';
import Hero from '../components/Hero';
import OurStrength from '../components/OurStrength';
import TrustStats from '../components/TrustStats';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import BlogSection from '../components/BlogSection';
import VideoSection from '../components/VideoSection';
import ScrapEstimator from '../static/QuoteRequest';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import SEO from '../components/SEO';
import { LanguagePack } from '../types';

interface HomePageProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function HomePage({ lang, t }: HomePageProps) {
  return (
    <>
      <SEO 
        canonicalPath={`/${lang}/`}
        lang={lang}
      />
      {/* Interactive Hero Slider with custom slides & WhatsApp triggers */}
      <HeroSlider lang={lang} t={t} />

      {/* Hero Trust Overview & Authority triggers */}
      <Hero lang={lang} t={t} />

      {/* Our Strength Equipment & Fleet Section */}
      <OurStrength lang={lang} t={t} />

      {/* Reciprocity info section highlighting free services */}
      <section className="bg-white py-12 border-b border-slate-100" id="our-process">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 flex flex-col items-start text-right md:text-start">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 w-full">
              🤝 {t.reciprocityTitle}
            </h3>
            <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed max-w-4xl">
              {t.reciprocityDesc}
            </p>
          </div>
          <div className="md:col-span-4 bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-4xl mb-3">⚖️</span>
            <h4 className="font-extrabold text-emerald-800 text-sm md:text-base">{lang === 'ar' ? "ميزان إلكتروني دقيق ومعتمد" : "100% Calibrated Scales"}</h4>
            <p className="text-xs text-emerald-700/80 mt-1 max-w-xs font-semibold leading-relaxed">
              {lang === 'ar' 
                ? "نزن جميع المعادن والمكيفات بموازين رقمية معتمدة أمام عينيك لتضمن أدق قيمة لقطعك السكراب." 
                : "We weigh all scrap materials transparently on certified, precision digital meters at your location."}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Metric bar */}
      <TrustStats lang={lang} t={t} />

      {/* Services section */}
      <Services lang={lang} t={t} />

      {/* Why Choose Shera Scrap Buyers section */}
      <WhyChooseUs lang={lang} t={t} />

      <React.Suspense fallback={<div className="py-12 bg-slate-900/10 min-h-[150px]" />}>
        {/* Blog / Articles Section */}
        <BlogSection lang={lang} />

        {/* Video Posts Section */}
        <VideoSection lang={lang} />

        {/* AI Scrap Estimator */}
        <ScrapEstimator lang={lang} t={t} />

        {/* Testimonials section */}
        <Testimonials lang={lang} t={t} />

        {/* Contact details panel & Map embed */}
        <ContactForm lang={lang} t={t} />

        {/* Answer-First FAQs */}
        <FAQ lang={lang} t={t} />
      </React.Suspense>
    </>
  );
}
