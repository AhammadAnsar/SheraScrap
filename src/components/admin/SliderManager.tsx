import React, { useState } from 'react';
import { Sliders, Plus, Edit2, Trash2, Eye, EyeOff, Save, Image, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { SliderSlide } from '../../cms/types';
import ImageUploader from './ImageUploader';

interface SliderManagerProps {
  lang: 'ar' | 'en';
}

export default function SliderManager({ lang }: SliderManagerProps) {
  const { cmsData, addSlide, updateSlide, deleteSlide } = useCMS();
  const isRtl = lang === 'ar';

  const [editingSlide, setEditingSlide] = useState<SliderSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const samplePhotos = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1605557202138-097824c3f8c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1200&q=80"
  ];

  const handleOpenAdd = () => {
    setEditingSlide({
      id: '',
      titleAr: 'عنوان الشريحة الجديد',
      titleEn: 'New Slide Heading',
      subtitleAr: 'وصف تفصيلي للشريحة والخدمات المتاحة مع إمكانية التواصل الفوري.',
      subtitleEn: 'Detailed slide description and instant WhatsApp CTA button.',
      badgeAr: 'خدمة متميزة بالشرقية',
      badgeEn: 'Certified Service',
      image: samplePhotos[0],
      ctaTextAr: 'تواصل معنا الآن',
      ctaTextEn: 'Contact Us Now',
      ctaType: 'whatsapp',
      order: cmsData.slides.length + 1,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: SliderSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    if (editingSlide.id) {
      updateSlide(editingSlide.id, editingSlide);
    } else {
      addSlide(editingSlide);
    }
    setIsModalOpen(false);
    setEditingSlide(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <span>{isRtl ? "إدارة شرائح السلايدر الرئيسي (Hero Slider Manager)" : "Hero Slider Manager"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "إضافة وتعديل صور وعناوين وأزرار السلايدر المتحرك بواجهة الموقع" 
              : "Add, edit, or toggle slides displayed in the homepage main header slider"}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? "إضافة شريحة جديدة" : "Add New Slide"}</span>
        </button>
      </div>

      {/* Slides Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {cmsData.slides.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              slide.active ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
            }`}
          >
            {/* Slide Preview Card Image */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-950 relative border border-slate-800 shrink-0">
                <img src={slide.image} alt={slide.titleAr} className="w-full h-full object-cover" />
                <span className="absolute top-1 right-1 bg-slate-900/90 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded font-bold">
                  #{idx + 1}
                </span>
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-md font-extrabold border border-emerald-500/20">
                    {slide.badgeAr}
                  </span>
                  {!slide.active && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-md font-bold">
                      {isRtl ? 'معطل' : 'Disabled'}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-white mt-1">
                  {isRtl ? slide.titleAr : slide.titleEn}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">
                  {isRtl ? slide.subtitleAr : slide.subtitleEn}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto justify-end">
              <button
                onClick={() => updateSlide(slide.id, { active: !slide.active })}
                className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  slide.active 
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
                title="تفعيل/تعطيل"
              >
                {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleOpenEdit(slide)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl border border-slate-700 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{isRtl ? "تعديل" : "Edit"}</span>
              </button>

              <button
                onClick={() => deleteSlide(slide.id)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/20 transition-colors cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>{editingSlide.id ? (isRtl ? "تعديل شريحة السلايدر" : "Edit Slide") : (isRtl ? "إضافة شريحة جديدة" : "New Slide")}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "العنوان الرئيسي (عربي)" : "Main Heading (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingSlide.titleAr}
                    onChange={(e) => setEditingSlide({ ...editingSlide, titleAr: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "العنوان الرئيسي (إنجليزي)" : "Main Heading (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingSlide.titleEn}
                    onChange={(e) => setEditingSlide({ ...editingSlide, titleEn: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "النص الفرعي (عربي)" : "Sub-description (Arabic)"}
                  </label>
                  <textarea
                    value={editingSlide.subtitleAr}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitleAr: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "النص الفرعي (إنجليزي)" : "Sub-description (English)"}
                  </label>
                  <textarea
                    value={editingSlide.subtitleEn}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitleEn: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "شارة التميز العلوبة (عربي)" : "Top Badge (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badgeAr}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badgeAr: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "شارة التميز العلوبة (إنجليزي)" : "Top Badge (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badgeEn}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badgeEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <ImageUploader
                label={isRtl ? "صورة خلفية الشريحة (رفع مباشر أو رابط)" : "Slide Background Photo (Upload from device or URL)"}
                value={editingSlide.image}
                onChange={(url) => setEditingSlide({ ...editingSlide, image: url })}
                isRtl={isRtl}
              />

              {/* Quick Sample Photos */}
              <div className="mt-2">
                <span className="text-[11px] text-slate-400 font-bold block mb-1">
                  {isRtl ? "أو اختر من الصور الحقيقية الجاهزة:" : "Or select real scrap photo:"}
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {samplePhotos.map((imgUrl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setEditingSlide({ ...editingSlide, image: imgUrl })}
                      className={`h-12 rounded-lg overflow-hidden border transition-all ${
                        editingSlide.image === imgUrl ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "نص زر التواصل (عربي)" : "CTA Button Text (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaTextAr}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaTextAr: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "نص زر التواصل (إنجليزي)" : "CTA Button Text (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingSlide.ctaTextEn}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaTextEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400"
                >
                  {isRtl ? "حفظ الشريحة" : "Save Slide"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
