const fs = require('fs');
let code = fs.readFileSync('src/pages/CategorySinglePage.tsx', 'utf8');

code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/pages/CategorySinglePage.tsx', code);
console.log("Fixed backticks in CategorySinglePage");
