const fs = require('fs');
const file = 'node_modules/formdata-polyfill/FormData.js';
if (fs.existsSync(file)) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/global\.fetch\s*=\s*function/, 'global.fetch = global.fetch || function');
  fs.writeFileSync(file, code);
  console.log("Patched formdata-polyfill");
} else {
  console.log("formdata-polyfill not found");
}
