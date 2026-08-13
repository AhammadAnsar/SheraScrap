import React, { useState } from 'react';
import { Download, Upload, RotateCcw, ShieldAlert, CheckCircle2, FileJson } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface BackupRestoreManagerProps {
  lang: 'ar' | 'en';
}

export default function BackupRestoreManager({ lang }: BackupRestoreManagerProps) {
  const { exportCMSData, importCMSData, resetToDefaults } = useCMS();
  const isRtl = lang === 'ar';

  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = exportCMSData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shera_scrap_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    const ok = importCMSData(jsonInput);
    if (ok) {
      setImportStatus(isRtl ? 'تم استعادة جميع البيانات بنجاح!' : 'Backup restored successfully!');
      setJsonInput('');
    } else {
      setImportStatus(isRtl ? 'خطأ: صيغة ملف JSON غير صحيحة' : 'Error: Invalid JSON format');
    }
  };

  const handleReset = () => {
    if (window.confirm(isRtl ? 'هل أنت تأكد من إعادة ضبط المصنع؟ سيتم استرجاع جميع البيانات الافتراضية.' : 'Are you sure you want to reset all CMS data to factory defaults?')) {
      resetToDefaults();
      setImportStatus(isRtl ? 'تمت إعادة ضبط البيانات بنجاح!' : 'Reset to defaults completed!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <FileJson className="w-5 h-5 text-emerald-400" />
          <span>{isRtl ? "نسخ احتياطي واستعادة البيانات (Backup & Restore)" : "Backup & Restore"}</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          {isRtl 
            ? "تصدير نسخة احتياطية من إعدادات الموقع والمقالات أو استعادتها وإعادة ضبط المصنع" 
            : "Export CMS database backup, import JSON configuration, or perform factory reset"}
        </p>
      </div>

      {importStatus && (
        <div className="bg-slate-800 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{importStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Backup */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-extrabold text-white">
              {isRtl ? "تصدير نسخة احتياطية (JSON)" : "Export Database Backup"}
            </h2>
          </div>
          <p className="text-slate-400 text-xs">
            {isRtl 
              ? "تحميل ملف JSON شامل يحتوي على جميع السلايدرات والمقالات والأصناف والطلبات والإعدادات." 
              : "Download full JSON file containing all settings, posts, categories, and inquiries."}
          </p>

          <button
            onClick={handleDownloadBackup}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isRtl ? "تحميل النسخة الاحتياطية الآن" : "Download Backup JSON"}</span>
          </button>
        </div>

        {/* Factory Reset */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <RotateCcw className="w-5 h-5" />
            <h2 className="text-sm font-extrabold text-white">
              {isRtl ? "إعادة ضبط المصنع" : "Factory Reset Defaults"}
            </h2>
          </div>
          <p className="text-slate-400 text-xs">
            {isRtl 
              ? "استعادة البيانات الافتراضية الأولية بالكامل ومسح التغييرات المحلية." 
              : "Revert all settings and categories to factory default data."}
          </p>

          <button
            onClick={handleReset}
            className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isRtl ? "إعادة ضبط البيانات للافتراضي" : "Reset Data to Defaults"}</span>
          </button>
        </div>

      </div>

      {/* Import Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-extrabold text-white">
            {isRtl ? "استعادة بيانات من كود JSON" : "Import / Restore JSON Data"}
          </h2>
        </div>

        <form onSubmit={handleImportSubmit} className="space-y-3">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={5}
            placeholder={isRtl ? "الصق كود JSON للنسخة الاحتياطية هنا..." : "Paste JSON backup code here..."}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs font-mono"
          />

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2.5 px-5 rounded-xl text-xs transition-all cursor-pointer"
          >
            {isRtl ? "استعادة الملف" : "Restore Data"}
          </button>
        </form>
      </div>

    </div>
  );
}
