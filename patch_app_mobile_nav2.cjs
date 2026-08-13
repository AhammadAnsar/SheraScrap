const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetMobileNav = `p-3 pb-safe`;
code = code.replace(targetMobileNav, `p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched Mobile Nav safe area");
