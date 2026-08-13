const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Replace standard grid with Bento-style Premium Grid
const oldGrid = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">`;
const newGrid = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">`;

code = code.replace(oldGrid, newGrid);

// Update cards in Hero.tsx
const oldCardTarget = `className="bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl group"`;
const newCardTarget = `className="bg-white border border-slate-100 hover:border-emerald-500/50 rounded-[2rem] p-6 sm:p-8 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] group flex flex-col items-start relative overflow-hidden"`;
code = code.replace(new RegExp(oldCardTarget, 'g'), newCardTarget); // Use global replace

// Make the icons larger and premium inside the card
const oldIconContainer = `className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform shadow-md"`;
const newIconContainer = `className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 group-hover:-translate-y-1 transition-transform shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50"`;
code = code.replace(new RegExp(oldIconContainer, 'g'), newIconContainer);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log("Patched Hero cards to Premium Bento style");
