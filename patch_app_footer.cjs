const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCredit = `<p className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span>{isRtl ? "تصميم وتطوير بواسطة:" : "Design and Development by"}</span>
              <a 
                href="https://softdows.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-emerald-300 transition-colors"
              >
                SoftDows (softdows.com)
              </a>
            </p>`;

const newCredit = `{!theme.enableWhiteLabel && (
            <p className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span>{isRtl ? "تصميم وتطوير بواسطة:" : "Design and Development by"}</span>
              <a 
                href="https://softdows.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-emerald-300 transition-colors"
              >
                SoftDows (softdows.com)
              </a>
            </p>
            )}`;

code = code.replace(oldCredit, newCredit);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx footer");
