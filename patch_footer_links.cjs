const fs = require('fs');
let code = fs.readFileSync('src/components/AppLayout.tsx', 'utf8');

const dynamicLinks = `
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="/services" className="hover:text-white transition-colors">{isRtl ? "خدماتنا" : "Services"}</a>
            <a href="/blog" className="hover:text-white transition-colors">{isRtl ? "المقالات" : "Blog"}</a>
            <a href="/estimator" className="hover:text-white transition-colors">{isRtl ? "مقيّم الذكاء الاصطناعي" : "AI Estimator"}</a>
            <a href="/faq" className="hover:text-white transition-colors">{isRtl ? "الأسئلة الشائعة" : "FAQ"}</a>
            {cmsData.pages.filter(p => p.isPublished).map(p => (
              <a key={p.id} href={\`/pages/\${p.slug}\`} className="hover:text-white transition-colors">{isRtl ? p.titleAr : p.titleEn}</a>
            ))}
          </div>`;

code = code.replace(
  /<div className="flex gap-4">[\s\S]*?<\/div>/,
  dynamicLinks
);

fs.writeFileSync('src/components/AppLayout.tsx', code);
console.log("Patched AppLayout links");
