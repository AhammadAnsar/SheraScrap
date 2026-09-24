const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  "import { useNavigate, useLocation } from 'react-router-dom';",
  "import { useNavigate, useLocation, Link } from 'react-router-dom';"
);

const oldNav = `<nav className="hidden xl:flex items-center gap-7 text-sm font-bold text-slate-700">
          <button onClick={() => scrollToSection('services')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "خدماتنا" : "Services"}</button>
          <button onClick={() => scrollToSection('blog-articles')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "المقالات والأخبار" : "Blog & Guides"}</button>
          <button onClick={() => scrollToSection('estimator')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "مقيّم الذكاء الاصطناعي" : "AI Estimator"}</button>
          <button onClick={() => scrollToSection('why-choose-us')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "لماذا نحن" : "Why Choose Us"}</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "اتصل بنا" : "Contact"}</button>
        </nav>`;

const newNav = `<nav className="hidden xl:flex items-center gap-7 text-sm font-bold text-slate-700">
          <Link to="/services" className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "خدماتنا" : "Services"}</Link>
          <Link to="/blog" className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "المقالات والأخبار" : "Blog & Guides"}</Link>
          <Link to="/estimator" className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "مقيّم الذكاء الاصطناعي" : "AI Estimator"}</Link>
          <Link to="/about" className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "لماذا نحن" : "Why Choose Us"}</Link>
          <Link to="/faq" className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</Link>
          <Link to="/contact" className="hover:text-emerald-600 transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-emerald-600">{isRtl ? "اتصل بنا" : "Contact"}</Link>
        </nav>`;

code = code.replace(oldNav, newNav);

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Patched Header.tsx");
