const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The string to replace
const oldNavStart = '{/* Mobile High-Conversion Sticky Bottom Navigation Bar (Phone + WhatsApp) */}';
const targetIndex = code.indexOf(oldNavStart);

if (targetIndex !== -1) {
  const endIndex = code.indexOf('</div>', targetIndex + 50) + 6; // find the closing div
  
  const newMobileNav = `      {/* Premium Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.08)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
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
      
  code = code.substring(0, targetIndex) + newMobileNav + code.substring(endIndex);
  
  code = code.replace(
    'className="bg-slate-900 text-slate-400 pt-12 pb-24 md:pb-12 px-4 border-t border-slate-800"',
    'className="bg-slate-900 text-slate-400 pt-16 pb-28 md:pb-12 px-4 border-t border-slate-800"'
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed Mobile Nav successfully!");
} else {
  console.log("Nav not found");
}

