const fs = require('fs');
let code = fs.readFileSync('src/components/Services.tsx', 'utf8');

code = code.replace(
  "import React from 'react';",
  "import React from 'react';\nimport { Link } from 'react-router-dom';"
);

// We want to wrap the Category Title in a Link
const oldTitle = `<h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                      {categoryTitle}
                    </h3>`;
const newTitle = `<Link to={\`/category/\${cat.slug || cat.id}\`} className="hover:text-emerald-700 transition-colors block">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                        {categoryTitle}
                      </h3>
                    </Link>`;

code = code.replace(oldTitle, newTitle);

// Also let's wrap the image in a link
const oldImage = `<div className="h-52 sm:h-56 w-full overflow-hidden relative bg-slate-900 border-b border-slate-100">`;
const newImage = `<Link to={\`/category/\${cat.slug || cat.id}\`} className="h-52 sm:h-56 w-full overflow-hidden relative bg-slate-900 border-b border-slate-100 block group-hover:opacity-95">`;

code = code.replace(oldImage, newImage);
code = code.replace(
  `{isFirstOrLast && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-slate-950 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <span>🔥</span>
                        <span>{isRtl ? "الأعلى طلباً كاش" : "Top Cash Value"}</span>
                      </div>
                    )}
                  </div>`,
  `{isFirstOrLast && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-slate-950 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <span>🔥</span>
                        <span>{isRtl ? "الأعلى طلباً كاش" : "Top Cash Value"}</span>
                      </div>
                    )}
                  </Link>`
);

fs.writeFileSync('src/components/Services.tsx', code);
console.log("Patched Services links");
