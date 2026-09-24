const fs = require('fs');
let code = fs.readFileSync('src/cms/defaultData.ts', 'utf8');

code = code.replace(
  'enableFloatingWhatsapp: true,',
  'enableFloatingWhatsapp: true,\n    enableWhiteLabel: false,'
);

fs.writeFileSync('src/cms/defaultData.ts', code);
console.log("Patched defaultData.ts");
