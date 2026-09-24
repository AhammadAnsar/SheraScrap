const fs = require('fs');
let code = fs.readFileSync('src/components/admin/CustomizationManager.tsx', 'utf8');

const whatsappToggle = `              <span className="text-xs font-bold text-slate-200">
                {isRtl ? "تفعيل زر الواتساب العائم أسفل الشاشة" : "Enable Floating WhatsApp Button"}
              </span>
            </label>`;

const whiteLabelToggle = `              <span className="text-xs font-bold text-slate-200">
                {isRtl ? "تفعيل زر الواتساب العائم أسفل الشاشة" : "Enable Floating WhatsApp Button"}
              </span>
            </label>

            <label className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={themeConfig.enableWhiteLabel || false}
                onChange={(e) => setThemeConfig({ ...themeConfig, enableWhiteLabel: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-200">
                {isRtl ? "تفعيل الواجهة البيضاء (إخفاء شعارات واسم النظام)" : "Enable White Label (Hide CMS Branding)"}
              </span>
            </label>`;

code = code.replace(whatsappToggle, whiteLabelToggle);
fs.writeFileSync('src/components/admin/CustomizationManager.tsx', code);
console.log("Patched CustomizationManager.tsx");
