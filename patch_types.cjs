const fs = require('fs');
let code = fs.readFileSync('src/cms/types.ts', 'utf8');

code = code.replace(
  'enableFloatingWhatsapp: boolean;',
  'enableFloatingWhatsapp: boolean;\n  enableWhiteLabel?: boolean;'
);

fs.writeFileSync('src/cms/types.ts', code);
console.log("Patched types.ts");
