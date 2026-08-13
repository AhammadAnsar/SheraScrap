const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

const target = `{/* WordPress Sidebar */}`;
const replace = `{mobileMenuOpen && (
          <div 
            className="md:hidden absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        {/* WordPress Sidebar */}`;

if(code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
  console.log('Patched AdminLayout mobile overlay.');
}
