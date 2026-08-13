const fs = require('fs');
let code = fs.readFileSync('src/components/OurStrength.tsx', 'utf8');

// Fix the hardcoded Bengali text
code = code.replace(
  '<span>{isRtl ? "আমাদের সামর্থ • قدراتنا ومعداتنا" : "Our Strength & Heavy Fleet"}</span>',
  '<span>{isRtl ? "قدراتنا ومعداتنا" : "Our Heavy Fleet"}</span>'
);

// Enhance Card styling for mobile-first
const oldCardTarget = `className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 group shadow-lg flex flex-col h-full relative overflow-hidden"`;
const newCardTarget = `className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/40 rounded-[2rem] p-6 sm:p-8 transition-all duration-300 group shadow-xl hover:-translate-y-1 flex flex-col h-full relative overflow-hidden backdrop-blur-sm"`;
code = code.replace(new RegExp(oldCardTarget, 'g'), newCardTarget);

fs.writeFileSync('src/components/OurStrength.tsx', code);
console.log("Patched OurStrength.tsx");
