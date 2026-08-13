import React, { useState } from 'react';
import { LayoutGrid, Quote, Calculator, ShieldCheck, HelpCircle, PhoneCall } from 'lucide-react';
import TestimonialManager from './TestimonialManager';
import EstimatorManager from './EstimatorManager';
import WhyUsManager from './WhyUsManager';
import FaqManager from './FaqManager';
import ContactUsManager from './ContactUsManager';

interface SectionManagerProps {
  lang: 'ar' | 'en';
  initialTab?: 'contact' | 'testimonials' | 'estimator' | 'whyus' | 'faq';
}

export default function SectionManager({ lang, initialTab = 'contact' }: SectionManagerProps) {
  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'contact' | 'testimonials' | 'estimator' | 'whyus' | 'faq'>(initialTab);

  const subTabs = [
    {
      id: 'contact' as const,
      labelAr: 'تواصل معنا (Contact Us)',
      labelEn: 'Contact Us',
      icon: PhoneCall,
    },
    {
      id: 'testimonials' as const,
      labelAr: 'آراء العملاء (Testimonials)',
      labelEn: 'Testimonials',
      icon: Quote,
    },
    {
      id: 'estimator' as const,
      labelAr: 'حاسبة التقييم (AI Estimator)',
      labelEn: 'AI Estimator',
      icon: Calculator,
    },
    {
      id: 'whyus' as const,
      labelAr: 'لماذا نحن (Why Choose Us)',
      labelEn: 'Why Choose Us',
      icon: ShieldCheck,
    },
    {
      id: 'faq' as const,
      labelAr: 'الأسئلة الشائعة (FAQ)',
      labelEn: 'FAQ',
      icon: HelpCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? 'إدارة أقسام الصفحة الرئيسية (Section Manager)' : 'Section Manager'}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl
              ? 'إدارة محتوى ومكونات أقسام الصفحة الرئيسية: بيانات الاتصال، الخرائط، الشبكات الاجتماعية، الآراء، الحاسبة، والمميزات'
              : 'Manage homepage sections: Contact & Map details, Social Media links, Testimonials, AI Estimator, and FAQ'}
          </p>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'contact' && <ContactUsManager lang={lang} />}
        {activeTab === 'testimonials' && <TestimonialManager lang={lang} />}
        {activeTab === 'estimator' && <EstimatorManager lang={lang} />}
        {activeTab === 'whyus' && <WhyUsManager lang={lang} />}
        {activeTab === 'faq' && <FaqManager lang={lang} />}
      </div>
    </div>
  );
}
