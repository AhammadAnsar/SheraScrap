const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Patch 1: AdminLayout in MainAppContent
code = code.replace(
  '<AdminLayout lang={lang} setLang={setLang} />',
  '<AdminLayout lang="en" setLang={setLang} />'
);
code = code.replace(
  '<div className="h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">',
  '<div dir="ltr" className="h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">'
);

// Patch 2: AdminLayout in MainWrapper
code = code.replace(
  '<AdminLayout lang="ar"',
  '<AdminLayout lang="en"'
);

// Patch 3: AdminBar
code = code.replace(
  '<AdminBar lang={lang} setLang={setLang} />',
  '<div dir="ltr"><AdminBar lang="en" setLang={setLang} /></div>'
);

// Patch 4: AdminLoginModal
code = code.replace(
  '<AdminLoginModal lang={lang} />',
  '<div dir="ltr"><AdminLoginModal lang="en" /></div>'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx admin language.");
