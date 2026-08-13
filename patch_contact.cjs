const fs = require('fs');
let code = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');

const oldInput = `className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm"`;
const newInput = `className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl px-4 py-3.5 sm:py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm shadow-sm"`;
code = code.replace(new RegExp(oldInput, 'g'), newInput);

const oldTextarea = `className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm min-h-[120px] resize-y"`;
const newTextarea = `className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl px-4 py-3.5 sm:py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm min-h-[120px] resize-y shadow-sm"`;
code = code.replace(oldTextarea, newTextarea);

const oldSubmit = `className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl flex justify-center items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"`;
const newSubmit = `className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl flex justify-center items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-emerald-600/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-base"`;
code = code.replace(oldSubmit, newSubmit);

const oldCard = `className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"`;
const newCard = `className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col justify-between h-full"`;
code = code.replace(new RegExp(oldCard, 'g'), newCard);

fs.writeFileSync('src/components/ContactForm.tsx', code);
console.log("Patched ContactForm to Premium UI");
