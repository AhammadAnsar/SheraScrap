const fs = require('fs');
let code = fs.readFileSync('src/components/admin/MediaLibraryModal.tsx', 'utf8');

const lastPart = code.substring(code.lastIndexOf("          )}"));

const newLastPart = `          )}
        </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {content}
    </div>
  );
}`;

code = code.substring(0, code.lastIndexOf("          )}")) + newLastPart;

fs.writeFileSync('src/components/admin/MediaLibraryModal.tsx', code);
console.log("Fixed end of file");
