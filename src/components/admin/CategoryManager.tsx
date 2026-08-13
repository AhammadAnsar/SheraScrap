import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Save, X, Scale, DollarSign } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { ScrapCategory } from '../../cms/types';
import ImageUploader from './ImageUploader';

interface CategoryManagerProps {
  lang: 'ar' | 'en';
}

export default function CategoryManager({ lang }: CategoryManagerProps) {
  const { cmsData, addCategory, updateCategory, deleteCategory } = useCMS();
  const isRtl = lang === 'ar';

  const [editingCategory, setEditingCategory] = useState<ScrapCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingCategory({
      id: '',
      slug: 'new-category-' + Date.now(),
      nameAr: 'قسم سكراب جديد',
      nameEn: 'New Scrap Category',
      descriptionAr: 'وصف نوع السكراب الشائع والخدمات المتاحة للاستلام.',
      descriptionEn: 'Scrap category description and pickup rates.',
      icon: 'Scale',
      rateEstimateAr: '10 - 25 ر.س / كجم',
      rateEstimateEn: '10 - 25 SAR / kg',
      baseRateSarPerKg: 15,
      featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
      order: cmsData.categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: ScrapCategory) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (editingCategory.id) {
      updateCategory(editingCategory.id, editingCategory);
    } else {
      addCategory(editingCategory);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? "إدارة أقسام وأسعار السكراب (Scrap Categories & Rates)" : "Scrap Categories & Daily Rates"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "تعديل أقسام الخردة (حديد، نحاس، مكيفات، ألمنيوم) وتحديث أسعار الشراء الكيلو/القطعة اليومية" 
              : "Manage scrap categories (Copper, Iron, ACs, Aluminum) and set daily buying rates"}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? "إضافة قسم جديد" : "Add Scrap Category"}</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cmsData.categories.map((cat) => (
          <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-32 bg-slate-950 relative border-b border-slate-800">
                <img src={cat.featuredImage} alt={cat.nameAr} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-slate-900/90 text-emerald-400 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {cat.rateEstimateAr}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-sm font-extrabold text-white">
                  {isRtl ? cat.nameAr : cat.nameEn}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2">
                  {isRtl ? cat.descriptionAr : cat.descriptionEn}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Base: {cat.baseRateSarPerKg} SAR/kg
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-400 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit/Add */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>{editingCategory.id ? (isRtl ? "تعديل قسم السكراب والأسعار" : "Edit Scrap Category") : (isRtl ? "إضافة قسم جديد" : "Add Category")}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "اسم القسم (عربي)" : "Category Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingCategory.nameAr}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nameAr: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "اسم القسم (إنجليزي)" : "Category Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingCategory.nameEn}
                    onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "السعر التقديري (عربي)" : "Rate Display (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={editingCategory.rateEstimateAr}
                    onChange={(e) => setEditingCategory({ ...editingCategory, rateEstimateAr: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isRtl ? "السعر التقديري (إنجليزي)" : "Rate Display (English)"}
                  </label>
                  <input
                    type="text"
                    value={editingCategory.rateEstimateEn}
                    onChange={(e) => setEditingCategory({ ...editingCategory, rateEstimateEn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <ImageUploader
                label={isRtl ? "صورة القسم (رفع مباشر من الجهاز أو رابط)" : "Category Image (Upload from device or URL)"}
                value={editingCategory.featuredImage}
                onChange={(url) => setEditingCategory({ ...editingCategory, featuredImage: url })}
                isRtl={isRtl}
              />

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الوصف التفصيلي للقسم" : "Category Description"}
                </label>
                <textarea
                  value={editingCategory.descriptionAr}
                  onChange={(e) => setEditingCategory({ ...editingCategory, descriptionAr: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400"
                >
                  {isRtl ? "حفظ القسم" : "Save Category"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
