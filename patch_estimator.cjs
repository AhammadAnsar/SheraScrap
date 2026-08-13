const fs = require('fs');
let code = fs.readFileSync('src/components/ScrapEstimator.tsx', 'utf8');

// Update main container of Estimator to look like a premium app
const oldContainer = `className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"`;
const newContainer = `className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.06)] relative overflow-hidden ring-1 ring-slate-950/5"`;
code = code.replace(oldContainer, newContainer);

// Make the category cards more prominent on mobile
const oldCatCard = `className=\`flex flex-col justify-between p-4 rounded-2xl border text-right transition-all cursor-pointer shadow-sm hover:shadow-md \${`;
const newCatCard = `className=\`flex flex-col justify-between p-4 sm:p-5 rounded-[1.5rem] border text-right transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_8px_25px_rgb(0,0,0,0.05)] hover:-translate-y-1 \${`;
code = code.replace(oldCatCard, newCatCard);

// Make next/prev buttons bigger and touch-friendly
const oldNextBtn = `className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-all cursor-pointer disabled:opacity-50"`;
const newNextBtn = `className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm sm:text-base flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 active:scale-95 disabled:opacity-50"`;
code = code.replace(oldNextBtn, newNextBtn);

const oldAnalyzeBtn = `className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-600/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"`;
const newAnalyzeBtn = `className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-600/30 cursor-pointer active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"`;
code = code.replace(oldAnalyzeBtn, newAnalyzeBtn);

fs.writeFileSync('src/components/ScrapEstimator.tsx', code);
console.log("Patched Scrap Estimator");
