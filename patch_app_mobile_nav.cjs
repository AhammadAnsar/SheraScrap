const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldMobileNav = `      {/* Mobile High-Conversion Sticky Bottom Navigation Bar (Phone + WhatsApp) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-4 shadow-2xl flex items-center justify-between gap-2">
        <a
          href={\`tel:\${cmsData.settings.phone}\`}
          className="flex-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs border border-slate-700/80 shadow-md"
        >
          <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{isRtl ? "اتصل فوراً" : "Call Now"}</span>
        </a>
        <a
          href={\`https://wa.me/\${cmsData.settings.whatsapp}?text=\${encodeURIComponent(isRtl ? 'السلام عليكم، أريد بيع سكراب بالدمام واستفسر عن الأسعار.' : 'Hello, I want to sell scrap metal in Dammam.')}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/30"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>{isRtl ? "واتساب مباشر" : "WhatsApp Direct"}</span>
        </a>
      </div>`;

const newMobileNav = `      {/* Premium Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.08)] p-3 pb-safe flex items-center justify-between gap-3">
        <a
          href={\`tel:\${cmsData.settings.phone}\`}
          className="flex-1 bg-slate-900 active:bg-slate-800 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg transition-transform active:scale-95"
        >
          <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{isRtl ? "اتصال فوري" : "Call Now"}</span>
        </a>
        <a
          href={\`https://wa.me/\${cmsData.settings.whatsapp}?text=\${encodeURIComponent(isRtl ? 'السلام عليكم، أريد بيع سكراب بالدمام واستفسر عن الأسعار.' : 'Hello, I want to sell scrap metal in Dammam.')}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-600 active:bg-emerald-700 text-white font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-600/20 transition-transform active:scale-95"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>{isRtl ? "تواصل واتساب" : "WhatsApp"}</span>
        </a>
      </div>`;

code = code.replace(oldMobileNav, newMobileNav);

// Also let's fix any `pb-24` on the footer to accommodate the new bigger sticky nav.
code = code.replace(
  'className="bg-slate-900 text-slate-400 pt-12 pb-24 md:pb-12 px-4 border-t border-slate-800"',
  'className="bg-slate-900 text-slate-400 pt-16 pb-28 md:pb-12 px-4 border-t border-slate-800"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched Mobile Nav in App.tsx");
