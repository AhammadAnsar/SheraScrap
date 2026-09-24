const fs = require('fs');
let code = fs.readFileSync('src/components/admin/MediaLibraryModal.tsx', 'utf8');

// Add isInline prop
code = code.replace(
  '  isRtl?: boolean;\n}',
  '  isRtl?: boolean;\n  isInline?: boolean;\n}'
);

code = code.replace(
  '  isRtl = true\n}: MediaLibraryModalProps) {',
  '  isRtl = true,\n  isInline = false\n}: MediaLibraryModalProps) {'
);

// Fix fetch URL
code = code.replace(
  "const res = await fetch('/api/media.php?t=' + Date.now());",
  "const res = await fetch('/api/media?t=' + Date.now());"
);

// Add delete function
const deleteFunc = `
  const handleDeleteMedia = async (fileName: string) => {
    if (!window.confirm(isRtl ? "هل أنت متأكد من حذف هذه الصورة بشكل نهائي؟" : "Are you sure you want to delete this image permanently?")) return;
    
    try {
      const res = await fetch(\`/api/media/\${fileName}\`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setServerMedia(prev => prev.filter(m => m.id !== fileName));
        if (selectedItem?.id === fileName) setSelectedItem(null);
      } else {
        alert(isRtl ? "فشل حذف الصورة" : "Failed to delete image");
      }
    } catch (err) {
      console.error(err);
      alert(isRtl ? "خطأ في الاتصال" : "Network error");
    }
  };
`;
code = code.replace('const fetchServerMedia = async () => {', deleteFunc + '\n  const fetchServerMedia = async () => {');

// Change render to handle isInline
const oldRenderStart = `  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}`;

const newRenderStart = `  if (!isOpen && !isInline) return null;

  const content = (
    <div className={\`bg-slate-900 \${isInline ? 'w-full rounded-3xl border border-slate-800' : 'w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]'}\`}>
      
      {/* Header */}`;
      
code = code.replace(oldRenderStart, newRenderStart);

const oldCloseButton = `<button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>`;
const newCloseButton = `{!isInline && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          )}`;
code = code.replace(oldCloseButton, newCloseButton);

// Add delete button next to "Use Selected Image"
const oldUseSelected = `<button
                    disabled={!selectedItem}
                    onClick={handleConfirmSelect}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isRtl ? "استخدام الصورة المختارة" : "Use Selected Image"}</span>
                  </button>`;
                  
const newUseSelected = `<div className="flex gap-2">
                  <button
                    disabled={!selectedItem}
                    onClick={() => {
                      if (selectedItem) handleDeleteMedia(selectedItem.id);
                    }}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 disabled:opacity-50 font-bold p-3 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                    title={isRtl ? "حذف الصورة" : "Delete Image"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    disabled={!selectedItem}
                    onClick={handleConfirmSelect}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isRtl ? "استخدام الصورة" : "Use Selected"}</span>
                  </button>
                </div>`;
code = code.replace(oldUseSelected, newUseSelected);

// Update return statement at the end of the file
const oldReturnEnd = `          )}
        </div>
      </div>
    </div>
  );
}`;

const newReturnEnd = `          )}
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
code = code.replace(oldReturnEnd, newReturnEnd);

// Fix "if (!isOpen) return null;" check which is originally at top
code = code.replace('if (!isOpen) return null;', ''); // We added our own check earlier

fs.writeFileSync('src/components/admin/MediaLibraryModal.tsx', code);
console.log("Patched MediaLibraryModal.tsx");
