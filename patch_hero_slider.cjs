const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSlider.tsx', 'utf8');

// Enhance typography in Slide 1
code = code.replace(
  'h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug mb-2.5"',
  'h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight"'
);

// Enhance buttons in Slide 1
code = code.replace(
  'className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 mt-6 w-full max-w-sm sm:max-w-none"',
  'className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-8 w-full"'
);

const oldWaBtn1 = `className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 border-2 border-emerald-500 cursor-pointer"`;
const newWaBtn1 = `className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-4 md:py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-xl shadow-emerald-900/50 hover:-translate-y-1 active:scale-95 border-2 border-emerald-500 cursor-pointer"`;
code = code.replace(oldWaBtn1, newWaBtn1);

const oldAiBtn1 = `className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"`;
const newAiBtn1 = `className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-emerald-400 border-2 border-slate-700 hover:border-emerald-500/50 font-black px-6 py-4 md:py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer hover:-translate-y-1 active:scale-95"`;
code = code.replace(oldAiBtn1, newAiBtn1);

// Enhance Slide 2 Typography
code = code.replace(
  'h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug mb-2.5"',
  'h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight"'
);

// Enhance Slide 3 Typography
code = code.replace(
  'h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug mb-2.5"',
  'h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight"'
);

// Enhance Slide 4 Typography
code = code.replace(
  'h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug mb-2.5"',
  'h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight"'
);

fs.writeFileSync('src/components/HeroSlider.tsx', code);
console.log("Patched HeroSlider typography and mobile buttons");
