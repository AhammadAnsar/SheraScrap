const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the imports and Router wrapping
code = code.replace(
  "import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';",
  `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesArchivePage from './pages/ServicesArchivePage';
import CategorySinglePage from './pages/CategorySinglePage';
import BlogArchivePage from './pages/BlogArchivePage';
import EstimatorPage from './pages/EstimatorPage';
import FAQPage from './pages/FAQPage';
import DynamicPage from './pages/DynamicPage';`
);

// We need to replace the entire `MainAppContent` component with our new layout approach
// Since MainAppContent is huge, it's better to just replace the whole App component and the MainAppContent definition.

const oldAppStart = code.indexOf('function MainAppContent() {');
const oldAppEnd = code.indexOf('export default function App() {');

// Remove MainAppContent entirely
code = code.slice(0, oldAppStart) + code.slice(oldAppEnd);

const oldRouter = `<CMSProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainAppContent />} />
          <Route path="/article/:slug" element={
            <MainWrapper><BlogPostPageWrapper /></MainWrapper>
          } />
        </Routes>
      </Router>
    </CMSProvider>`;

const newRouter = `<CMSProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainWrapper><HomePageWrapper /></MainWrapper>} />
          <Route path="/about" element={<MainWrapper><AboutPageWrapper /></MainWrapper>} />
          <Route path="/contact" element={<MainWrapper><ContactPageWrapper /></MainWrapper>} />
          <Route path="/services" element={<MainWrapper><ServicesArchivePageWrapper /></MainWrapper>} />
          <Route path="/services/:slug" element={<MainWrapper><CategorySinglePageWrapper /></MainWrapper>} />
          <Route path="/category/:slug" element={<MainWrapper><CategorySinglePageWrapper /></MainWrapper>} />
          <Route path="/blog" element={<MainWrapper><BlogArchivePageWrapper /></MainWrapper>} />
          <Route path="/blog/:slug" element={<MainWrapper><BlogPostPageWrapper /></MainWrapper>} />
          <Route path="/article/:slug" element={<MainWrapper><BlogPostPageWrapper /></MainWrapper>} />
          <Route path="/articles/:slug" element={<MainWrapper><BlogPostPageWrapper /></MainWrapper>} />
          <Route path="/estimator" element={<MainWrapper><EstimatorPageWrapper /></MainWrapper>} />
          <Route path="/faq" element={<MainWrapper><FAQPageWrapper /></MainWrapper>} />
          <Route path="/pages/:slug" element={<MainWrapper><DynamicPageWrapper /></MainWrapper>} />
        </Routes>
      </Router>
    </CMSProvider>`;

code = code.replace(oldRouter, newRouter);

// Add the wrapper components at the end
const wrappers = `
function useLangSetup() {
  const [lang, setLang] = React.useState<'ar' | 'en'>('ar');
  const t = lang === 'ar' ? arabicTranslations : englishTranslations;
  
  React.useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isMiddleEastZone = ['Asia/Riyadh', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Bahrain', 'Asia/Dubai', 'Asia/Muscat', 'Africa/Cairo'].some(tz => timeZone && timeZone.includes(tz));
      const browserLang = navigator.language || (navigator as any).userLanguage;
      const isArabicDevice = browserLang && browserLang.startsWith('ar');
      if (isMiddleEastZone || isArabicDevice) {
        setLang('ar');
      } else {
        setLang('en');
      }
    } catch (e) {
      setLang('ar');
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return { lang, setLang, t };
}

function HomePageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><HomePage lang={lang} t={t} /></AppLayout>;
}

function AboutPageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><AboutPage lang={lang} t={t} /></AppLayout>;
}

function ContactPageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><ContactPage lang={lang} t={t} /></AppLayout>;
}

function ServicesArchivePageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><ServicesArchivePage lang={lang} t={t} /></AppLayout>;
}

function CategorySinglePageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><CategorySinglePage lang={lang} /></AppLayout>;
}

function BlogArchivePageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><BlogArchivePage lang={lang} t={t} /></AppLayout>;
}

function EstimatorPageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><EstimatorPage lang={lang} t={t} /></AppLayout>;
}

function FAQPageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><FAQPage lang={lang} t={t} /></AppLayout>;
}

function DynamicPageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><DynamicPage lang={lang} /></AppLayout>;
}

// We also need to redefine BlogPostPageWrapper to use AppLayout
function BlogPostPageWrapper() {
  const { lang, setLang, t } = useLangSetup();
  return <AppLayout lang={lang} setLang={setLang} t={t}><BlogPostPage lang={lang} setLang={setLang} t={t} /></AppLayout>;
}
`;

// Replace existing wrappers at bottom
const oldWrappersStart = code.indexOf('function MainWrapper');
code = code.slice(0, oldWrappersStart);

// But we still need MainWrapper itself
const mainWrapper = `function MainWrapper({ children }: { children: React.ReactNode }) {
  const { cmsData, isAdminOpen, currentUser } = useCMS();
  if (isAdminOpen && currentUser) {
    return <div className="h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden"><React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Admin System...</div>}><AdminLayout lang="en" setLang={()=>{}} /></React.Suspense></div>;
  }
  return <>{children}</>;
}
`;

code = code + mainWrapper + wrappers;

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for Routing");
