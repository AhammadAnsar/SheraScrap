import React, { useState } from 'react';
import { Image as ImageIcon, Upload, FileImage } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import { useCMS } from '../../cms/CMSContext';

interface MediaTabProps {
  lang: 'ar' | 'en';
}

export default function MediaTab({ lang }: MediaTabProps) {
  const isRtl = lang === 'ar';
  const { cmsData } = useCMS();
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <FileImage className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">
              {isRtl ? "إدارة مكتبة الوسائط والصور (Media Library)" : "Media Library Management"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isRtl ? "رفع وعرض وإدارة جميع الصور والملفات المرفوعة على سيرفر Hostinger" : "Manage all uploaded pictures and media files on Hostinger server"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl flex items-center gap-2 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>{isRtl ? "فتح معرض الصور والرفع" : "Open Media Gallery"}</span>
        </button>
      </div>

      {/* Embedded Library Modal View */}
      <MediaLibraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectImage={(url) => {
          navigator.clipboard.writeText(url);
          alert(isRtl ? `تم نسخ رابط الصورة: ${url}` : `Copied image URL: ${url}`);
        }}
        isRtl={isRtl}
      />

      {/* Info Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-800 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">
          {isRtl ? "تخزين دائم في مجلد /uploads/ على السيرفر" : "Persistent Storage in /uploads/ folder"}
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          {isRtl
            ? "جميع الصور التي تقوم برفعها هنا أو في أجزاء المقالات والخدمات يتم حفظها مباشرة في مجلد /uploads/ على سيرفر Hostinger الخاص بك. يمكنك الوصول إليها واستخدامها في أي مكان بالموقع."
            : "All images uploaded here or in blog posts & services are stored directly in Hostinger's /uploads/ folder and persist permanently across all devices."}
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all inline-flex items-center gap-2"
        >
          <FileImage className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? "عرض جميع الملفات والصور" : "View All Media Files"}</span>
        </button>
      </div>

    </div>
  );
}
