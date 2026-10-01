import { mediaFetch, uploadImage } from '../../utils/mediaUpload';
import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Search, Check, Copy, CheckCircle, Trash2, Loader2, Link as LinkIcon, RefreshCw, Sparkles } from 'lucide-react';
import { MediaItem } from '../../cms/types';
import { useCMS } from '../../cms/CMSContext';
import { convertToWebP } from '../../utils/webpConverter';
import OptimizedImage from '../common/OptimizedImage';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  isRtl?: boolean;
  isInline?: boolean;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  isRtl = true,
  isInline = false
}: MediaLibraryModalProps) {
  const { cmsData, saveCMSData } = useCMS();
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [serverMedia, setServerMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch images from Hostinger server /api/media.php
  
  const handleDeleteMedia = async (fileName: string) => {
    if (!window.confirm(isRtl ? "هل أنت متأكد من حذف هذه الصورة بشكل نهائي؟" : "Are you sure you want to delete this image permanently?")) return;
    
    try {
      const res = await mediaFetch(`/api/media/${encodeURIComponent(fileName)}`, {
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

  const fetchServerMedia = async () => {
    setLoadingMedia(true);
    try {
      const res = await mediaFetch('/api/media?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && data.media && Array.isArray(data.media)) {
          setServerMedia(data.media);
        }
      }
    } catch (err) {
      console.warn("Could not fetch server media list:", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchServerMedia();
    }
  }, [isOpen]);

  

  // Combine static/CMS media with server /uploads/ media, avoiding duplicates by URL
  const cmsMediaList = cmsData.mediaLibrary || [];
  const mergedMediaMap = new Map<string, MediaItem>();

  // Add server uploaded files
  serverMedia.forEach(item => mergedMediaMap.set(item.url, item));
  // Add CMS stored media
  cmsMediaList.forEach(item => {
    if (!mergedMediaMap.has(item.url)) {
      mergedMediaMap.set(item.url, item);
    }
  });

  const allMediaItems = Array.from(mergedMediaMap.values());

  const filteredMedia = allMediaItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    // Convert file to WebP automatically for speed & Core Web Vitals
    let processedFile = file;
    try {
      processedFile = await convertToWebP(file, 0.85);
    } catch (webpErr) {
      console.warn("WebP conversion fallback:", webpErr);
    }

    try {
      const data = await uploadImage(processedFile);
      if (data.url) {
        const newMediaItem: MediaItem = {
          id: 'media-' + Date.now(),
          url: data.url,
          title: file.name,
          size: data.fileSize ? data.fileSize : 'Unknown',
          mimeType: file.type,
          date: new Date().toISOString().split('T')[0]
        };

        // Update CMS state
        const updatedLibrary = [newMediaItem, ...(cmsData.mediaLibrary || [])];
        saveCMSData({ ...cmsData, mediaLibrary: updatedLibrary });
        
        // Refresh server media list
        await fetchServerMedia();

        setSelectedItem(newMediaItem);
        setActiveTab('gallery');
      } else {
        throw new Error(data?.message || 'Server upload failed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please retry.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelectImage(selectedItem.url);
      onClose();
    }
  };

  if (!isOpen && !isInline) return null;

  const content = (
    <div className={`bg-slate-900 ${isInline ? 'w-full rounded-3xl border border-slate-800' : 'w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]'}`}>
      
      {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isRtl ? "مكتبة الصور والوسائط (Media Library)" : "Media Library"}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl ? "إدارة واختيار الصور المرفوعة على سيرفر Hostinger" : "Manage & select uploaded images"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
          <div className="flex gap-2 py-3">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isRtl ? "معرض الصور المخزنة" : "Media Gallery"} ({allMediaItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{isRtl ? "رفع صورة جديدة" : "Upload File"}</span>
            </button>
          </div>

          {activeTab === 'gallery' && (
            <div className="flex items-center gap-2">
              <button
                onClick={fetchServerMedia}
                disabled={loadingMedia}
                title={isRtl ? "إعادة تحديث الوسائط من السيرفر" : "Refresh server media"}
                className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingMedia ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isRtl ? "بحث في الصور..." : "Search images..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'gallery' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
              
              {/* Media Grid */}
              <div className="md:col-span-2 lg:col-span-3 space-y-4">
                {loadingMedia && (
                  <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    <span>{isRtl ? "جاري تحميل الصور من سيرفر Hostinger..." : "Loading media from server..."}</span>
                  </div>
                )}

                {!loadingMedia && filteredMedia.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl p-8 space-y-3">
                    <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-sm text-slate-400">
                      {isRtl ? "لا يوجد صور مطابقة للبحث أو المكتبة فارغة" : "No images found"}
                    </p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all"
                    >
                      {isRtl ? "رفع أول صورة الآن" : "Upload your first image"}
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedItem?.url === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all bg-slate-950 ${
                          isSelected
                            ? 'border-emerald-500 ring-4 ring-emerald-500/20 scale-[0.98]'
                            : 'border-slate-800 hover:border-slate-600 hover:scale-[1.02]'
                        }`}
                      >
                        <OptimizedImage
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-all group-hover:scale-105"
                        />

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg font-bold">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-2 pt-6">
                          <p className="text-[11px] font-medium text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[9px] text-slate-400 truncate">
                            {item.size || item.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Info Panel */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                {selectedItem ? (
                  <div className="space-y-4 overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? "تفاصيل الصورة المختارة" : "Image Details"}
                    </h3>

                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      <OptimizedImage
                        src={selectedItem.url}
                        alt={selectedItem.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">{isRtl ? "اسم الملف:" : "File name:"}</span>
                        <span className="text-white font-medium break-all">{selectedItem.title}</span>
                      </div>

                      {selectedItem.size && (
                        <div>
                          <span className="text-slate-500 text-[10px] block">{isRtl ? "الحجم:" : "Size:"}</span>
                          <span className="text-slate-300 font-mono">{selectedItem.size}</span>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-500 text-[10px] block">{isRtl ? "الرابط المباشر:" : "Direct URL:"}</span>
                        <div className="flex gap-1 mt-1">
                          <input
                            type="text"
                            readOnly
                            value={selectedItem.url}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-300 w-full font-mono truncate"
                          />
                          <button
                            onClick={() => handleCopyUrl(selectedItem.url)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                            title="Copy URL"
                          >
                            {copiedUrl ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-700" />
                    <p className="text-xs">
                      {isRtl ? "اختر صورة من المعرض لعرض تفاصيلها واستخدامها" : "Select an image from gallery to preview"}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex gap-2">
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
                </div>
                </div>
              </div>

            </div>
          ) : (
            /* Upload Tab */
            <div className="max-w-xl mx-auto py-8 space-y-6 text-center">
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl p-10 bg-slate-950/50 transition-all flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">
                    {uploading
                      ? (isRtl ? "جاري رفع الصورة إلى مجلد Server..." : "Uploading file to server...")
                      : (isRtl ? "اسحب وأسقط ملف الصورة هنا" : "Drag and drop your image here")}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRtl ? "يدعم بصيغ PNG, JPG, WEBP حتى 3 ميجابايت" : "Supports PNG, JPG, WEBP, up to 3MB"}
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-lg shadow-emerald-500/20">
                  <span>{isRtl ? "اختر ملف من جهازك" : "Browse File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadError && (
                <p className="text-xs text-rose-400 font-medium">{uploadError}</p>
              )}
            </div>
          )}
        </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {content}
    </div>
  );
}