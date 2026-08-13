const fs = require('fs');
let code = fs.readFileSync('src/components/BlogSection.tsx', 'utf8');

const startIdx = code.indexOf('{/* Post Modal Reader */}');
const endIdx = code.lastIndexOf('</section>');

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
  fs.writeFileSync('src/components/BlogSection.tsx', code);
  console.log("Removed modal.");
}
