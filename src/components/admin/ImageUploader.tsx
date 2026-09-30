import { uploadImage } from '../../utils/mediaUpload';
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, Loader2, Link as LinkIcon, FileImage, Sparkles } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import { convertToWebP } from '../../utils/webpConverter';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  isRtl?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  placeholder = "https://... or select from media library",
  isRtl = true
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(isRtl ? "الرجاء اختيار ملف صورة صالحة" : "Please select a valid image file");
      return;
    }

    setUploading(true);
    setError(null);

    // Convert PNG/JPG/BMP automatically to compressed WebP format for 100% Core Web Vitals
    let fileToUpload = file;
    try {
      fileToUpload = await convertToWebP(file, 0.85);
    } catch (webpErr) {
      console.warn("WebP conversion fallback to original file:", webpErr);
    }

    try {
      const data = await uploadImage(fileToUpload);
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please retry.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-300">
          <span>{label}</span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? (isRtl ? "رفع أو اختيار" : "Upload or Select") : (isRtl ? "أو أدخل رابط URL" : "or Enter URL")}</span>
          </button>
        </div>
      )}

      {/* Image Preview & Upload Container */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Preview box */}
        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900 shrink-0 overflow-hidden relative flex items-center justify-center">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-600" />
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 w-full space-y-2">
          {!showUrlInput ? (
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Media Library Trigger */}
              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
              >
                <FileImage className="w-4 h-4" />
                <span>{isRtl ? "اختر من مكتبة الوسائط" : "Media Library"}</span>
              </button>

              {/* Direct File Upload Trigger */}
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>{isRtl ? "جاري الرفع..." : "Uploading..."}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>{isRtl ? "رفع صورة جديدة" : "Upload New"}</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {value && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium truncate">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {value.startsWith('/uploads/') ? (isRtl ? "محفوظة في مجلد السيرفر (/uploads/)" : "Saved in server (/uploads/)") : value}
              </span>
            </div>
          )}

          {error && (
            <p className="text-[11px] text-rose-400 font-semibold">{error}</p>
          )}
        </div>
      </div>

      {/* WordPress-style Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelectImage={(url) => onChange(url)}
        isRtl={isRtl}
      />
    </div>
  );
}
