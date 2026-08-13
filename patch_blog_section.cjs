const fs = require('fs');
let code = fs.readFileSync('src/components/BlogSection.tsx', 'utf8');

// 1. Add import for Link and useNavigate
if (!code.includes("import { Link, useNavigate }")) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { Link, useNavigate } from 'react-router-dom';");
}

// 2. Change article div to Link
const targetArticle = `            <article 
              key={post.id}
              onClick={() => handleOpenPost(post)}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
            >`;

const replaceArticle = `            <Link 
              to={\`/article/\${post.id}\`}
              key={post.id}
              onClick={() => handleOpenPost(post)}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between block"
            >`;

code = code.replace(targetArticle, replaceArticle);
code = code.replace(targetArticle, replaceArticle); // just in case
code = code.replace(targetArticle, replaceArticle); // multiple if present

// 3. Close Link instead of article
code = code.replace(/<\/article>/g, "</Link>");

// 4. Remove the selectedPost modal
const modalTargetRegex = /{\/\* Post Reading Modal \*\/.+?<\/section>/s;
code = code.replace(modalTargetRegex, "</section>");

fs.writeFileSync('src/components/BlogSection.tsx', code);
console.log("Patched BlogSection");
