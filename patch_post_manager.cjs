const fs = require('fs');
let code = fs.readFileSync('src/components/admin/PostManager.tsx', 'utf8');

if(!code.includes("import RichTextEditor")) {
  code = code.replace("import { useCMS }", "import RichTextEditor from './RichTextEditor';\nimport { useCMS }");
}

const targetTextareaAr = `              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "المحتوى أو تفاصيل الفيديو (Markdown / Text)" : "Full Content / Video Details"}
                </label>
                <textarea
                  value={editingPost.contentAr}
                  onChange={(e) => setEditingPost({ ...editingPost, contentAr: e.target.value })}
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-sans leading-relaxed"
                />
              </div>`;

const replaceWithRichText = `              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "المحتوى (عربي)" : "Content (Arabic)"}
                </label>
                <RichTextEditor
                  value={editingPost.contentAr || ''}
                  onChange={(val) => setEditingPost({ ...editingPost, contentAr: val })}
                  isRtl={isRtl}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "المحتوى (إنجليزي)" : "Content (English)"}
                </label>
                <RichTextEditor
                  value={editingPost.contentEn || ''}
                  onChange={(val) => setEditingPost({ ...editingPost, contentEn: val })}
                  isRtl={false}
                />
              </div>`;

code = code.replace(targetTextareaAr, replaceWithRichText);

const targetExcerptAr = `              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الموجز / الوصف المختصر (عربي)" : "Excerpt / Short Description (Arabic)"}
                </label>
                <textarea
                  value={editingPost.excerptAr}
                  onChange={(e) => setEditingPost({ ...editingPost, excerptAr: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                />
              </div>`;

const replaceExcerptArAndEn = `              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الموجز / الوصف المختصر (عربي)" : "Excerpt (Arabic)"}
                </label>
                <textarea
                  value={editingPost.excerptAr || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerptAr: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الموجز / الوصف المختصر (إنجليزي)" : "Excerpt (English)"}
                </label>
                <textarea
                  value={editingPost.excerptEn || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerptEn: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                />
              </div>`;

code = code.replace(targetExcerptAr, replaceExcerptArAndEn);

fs.writeFileSync('src/components/admin/PostManager.tsx', code);
console.log("Patched PostManager");
