const fs = require('fs');

// 1. Patch RichTextEditor.tsx
let editorCode = fs.readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');
editorCode = editorCode.replace(/react-quill/g, 'react-quill-new');
fs.writeFileSync('src/components/admin/RichTextEditor.tsx', editorCode);
console.log("Patched RichTextEditor.tsx");

// 2. Patch AdminLayout.tsx to remove language toggle
let layoutCode = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');
const langToggleTarget = `<button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>`;
layoutCode = layoutCode.replace(langToggleTarget, '');
fs.writeFileSync('src/components/admin/AdminLayout.tsx', layoutCode);
console.log("Patched AdminLayout.tsx");

