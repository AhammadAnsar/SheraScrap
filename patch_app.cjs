const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if(!code.includes("import { BrowserRouter")) {
  code = code.replace("import { useCMS } from './cms/CMSContext';", "import { useCMS } from './cms/CMSContext';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport BlogPostPage from './components/BlogPostPage';");
}

const targetAppExport = `export default function App() {
  return (
    <CMSProvider>
      <MainAppContent />
    </CMSProvider>
  );
}`;

const replaceAppExport = `export default function App() {
  return (
    <CMSProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainAppContent />} />
          <Route path="/article/:slug" element={
            <MainWrapper><BlogPostPageWrapper /></MainWrapper>
          } />
        </Routes>
      </Router>
    </CMSProvider>
  );
}

// Wrapper to provide language context to child pages
function MainWrapper({ children }: { children: React.ReactNode }) {
  const { cmsData, isAdminOpen, currentUser } = useCMS();
  if (isAdminOpen && currentUser) {
    return <div className="h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden"><React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Admin System...</div>}><AdminLayout lang="ar" setLang={()=>{}} /></React.Suspense></div>;
  }
  return <>{children}</>;
}

function BlogPostPageWrapper() {
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

  return <BlogPostPage lang={lang} setLang={setLang} t={t} />;
}`;

if(code.includes(targetAppExport)) {
  code = code.replace(targetAppExport, replaceAppExport);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx with Router");
} else {
  console.log("Could not find App export in App.tsx");
}
