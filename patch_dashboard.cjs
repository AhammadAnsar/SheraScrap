const fs = require('fs');
let code = fs.readFileSync('src/components/admin/DashboardOverview.tsx', 'utf8');

code = code.replace(
  '<span>{isRtl ? "مرحباً بك في لوحة تحكم SoftDows CMS" : "Welcome to SoftDows CMS"}</span>',
  '<span>{cmsData.theme?.enableWhiteLabel ? (isRtl ? "مرحباً بك في لوحة التحكم" : "Welcome to Admin Dashboard") : (isRtl ? "مرحباً بك في لوحة تحكم SoftDows CMS" : "Welcome to SoftDows CMS")}</span>'
);

code = code.replace(
  '{isRtl ? "مسودة مقال سريعة (Quick Draft)" : "SoftDows Quick Draft"}',
  '{cmsData.theme?.enableWhiteLabel ? (isRtl ? "مسودة مقال سريعة" : "Quick Draft") : (isRtl ? "مسودة مقال سريعة (Quick Draft)" : "SoftDows Quick Draft")}'
);

fs.writeFileSync('src/components/admin/DashboardOverview.tsx', code);
console.log("Patched DashboardOverview.tsx");
