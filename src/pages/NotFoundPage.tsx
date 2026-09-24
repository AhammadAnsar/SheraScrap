import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

interface NotFoundPageProps {
  lang: 'ar' | 'en';
}

export default function NotFoundPage({ lang }: NotFoundPageProps) {
  const isRtl = lang === 'ar';

  return (
    <>
      <SEO 
        title={isRtl ? "404 - الصفحة غير موجودة" : "404 - Page Not Found"}
        description={isRtl ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها." : "Sorry, the page you are looking for does not exist or has been moved."}
        canonicalPath={`/${lang}/404`}
        lang={lang}
        noindex={true}
      />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <span className="text-emerald-600 font-black text-6xl md:text-8xl mb-4 tracking-tighter">404</span>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">
          {isRtl ? "الصفحة المطلوبة غير موجودة" : "Page Not Found"}
        </h1>
        <p className="text-slate-600 max-w-md mb-8 text-sm md:text-base leading-relaxed">
          {isRtl 
            ? "الصفحة التي تحاول الوصول إليها قد تكون تم حذفها أو تغيير اسمها أو أنها غير متاحة مؤقتاً."
            : "The page you are trying to reach might have been removed, renamed, or is temporarily unavailable."}
        </p>
        <Link 
          to={`/${lang}/`}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>{isRtl ? "العودة إلى الصفحة الرئيسية" : "Return to Homepage"}</span>
        </Link>
      </div>
    </>
  );
}
