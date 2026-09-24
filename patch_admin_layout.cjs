const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

code = code.replace(
  'isRtl ? "لوحة تحكم SoftDows CMS" : "SoftDows CMS Engine"',
  'cmsData.theme?.enableWhiteLabel ? (isRtl ? "لوحة التحكم" : "Admin Dashboard") : (isRtl ? "لوحة تحكم SoftDows CMS" : "SoftDows CMS Engine")'
);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
console.log("Patched AdminLayout.tsx");
