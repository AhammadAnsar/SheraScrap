import { serializeJson } from '../utils/serialize';
import React from 'react';
import { faqs as defaultFaqs } from '../data';
import { LanguagePack } from '../types';
import { useCMS } from '../cms/CMSContext';

interface FAQProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function FAQ({ lang, t }: FAQProps) {
  const { cmsData } = useCMS();
  const isRtl = lang === 'ar';

  const faqList = (cmsData.faqs !== undefined)
    ? cmsData.faqs.map(f => ({
        question: isRtl ? f.questionAr : f.questionEn,
        answer: isRtl ? f.answerAr : f.answerEn
      }))
    : [];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Section title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {isRtl ? "إجابات الأسئلة المتكررة" : "Dammam Scrap Guide FAQs"}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            {t.faqSubtitle}
          </p>
        </div>

        {/* FAQ Accordions utilizing Answer-First content structures */}
        <div className="space-y-4" id="faq-accordions-group">
          {faqList.map((faq, index) => {
            const question = faq.question;
            const answer = faq.answer;

            return (
              <details 
                key={index} 
                className="group bg-slate-50 border border-slate-200/50 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300"
                id={`faq-item-${index}`}
              >
                <summary className="flex justify-between items-center cursor-pointer focus:outline-none select-none">
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base pr-4 leading-tight">
                    {question}
                  </h3>
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180 bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>

                {/* Answer block */}
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                  <p>{answer}</p>
                </div>
              </details>
            );
          })}
        </div>

        {/* Structured Data (JSON-LD Schema Markup) for local and FAQ search validation */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: serializeJson({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqList.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
              }
            }))
          })
        }} />

      </div>
    </section>
  );
}
