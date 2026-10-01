import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  HardHat, 
  Truck, 
  Image as ImageIcon, 
  ListPlus,
  Sparkles
} from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { EquipmentItem } from '../../cms/types';
import MediaLibraryModal from './MediaLibraryModal';

interface EquipmentManagerProps {
  lang: 'ar' | 'en';
}

export default function EquipmentManager({ lang }: EquipmentManagerProps) {
  const { cmsData, addEquipment, updateEquipment, deleteEquipment } = useCMS();
  const isRtl = lang === 'ar';
  const equipments = cmsData.equipments || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<EquipmentItem, 'id'>>({
    titleAr: '',
    titleEn: '',
    subtitleAr: '',
    subtitleEn: '',
    capacityAr: '',
    capacityEn: '',
    descriptionAr: '',
    descriptionEn: '',
    image: '',
    specificationsAr: [''],
    specificationsEn: [''],
    active: true,
    order: equipments.length + 1
  });

  const resetForm = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      subtitleAr: '',
      subtitleEn: '',
      capacityAr: '',
      capacityEn: '',
      descriptionAr: '',
      descriptionEn: '',
      image: '',
      specificationsAr: [''],
      specificationsEn: [''],
      active: true,
      order: equipments.length + 1
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (item: EquipmentItem) => {
    setEditingId(item.id);
    setFormData({
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      subtitleAr: item.subtitleAr,
      subtitleEn: item.subtitleEn,
      capacityAr: item.capacityAr,
      capacityEn: item.capacityEn,
      descriptionAr: item.descriptionAr,
      descriptionEn: item.descriptionEn,
      image: item.image,
      specificationsAr: item.specificationsAr && item.specificationsAr.length > 0 ? item.specificationsAr : [''],
      specificationsEn: item.specificationsEn && item.specificationsEn.length > 0 ? item.specificationsEn : [''],
      active: item.active,
      order: item.order
    });
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr || !formData.titleEn) {
      alert(isRtl ? 'يرجى كتابة عنوان المعدّة باللغة العربية والإنجليزية' : 'Please provide equipment title in Arabic and English');
      return;
    }

    const cleanSpecsAr = (formData.specificationsAr || []).filter(s => s.trim() !== '');
    const cleanSpecsEn = (formData.specificationsEn || []).filter(s => s.trim() !== '');

    const payload = {
      ...formData,
      specificationsAr: cleanSpecsAr,
      specificationsEn: cleanSpecsEn,
      image: formData.image || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'
    };

    if (editingId) {
      updateEquipment(editingId, payload);
    } else {
      addEquipment(payload);
    }

    resetForm();
  };

  const handleAddSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      specificationsAr: [...(prev.specificationsAr || []), ''],
      specificationsEn: [...(prev.specificationsEn || []), '']
    }));
  };

  const handleSpecChange = (index: number, val: string, field: 'ar' | 'en') => {
    setFormData(prev => {
      const arr = [...(field === 'ar' ? (prev.specificationsAr || []) : (prev.specificationsEn || []))];
      arr[index] = val;
      return field === 'ar' ? { ...prev, specificationsAr: arr } : { ...prev, specificationsEn: arr };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isRtl ? "إدارة المعدات والآليات (Equipment Management)" : "Equipment & Fleet Management"}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {isRtl ? "إضافة وتعديل أسطول الشاحنات والموازين الهيدروليكية المعروضة بحسم 'سامرثنا'" : "Manage heavy scrap machinery, winches, weighbridges & cranes shown on homepage"}
            </p>
          </div>
        </div>

        {!isAdding && (
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? "إضافة معدة جديدة" : "Add New Equipment"}</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal / Block */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl space-y-6 shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <HardHat className="w-5 h-5 text-emerald-400" />
              <span>{editingId ? (isRtl ? 'تعديل بيانات المعدة' : 'Edit Equipment') : (isRtl ? 'إضافة معدة / آلية جديدة' : 'Add New Equipment')}</span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Arabic Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "اسم المعدة (عربي) *" : "Title (Arabic) *"}
              </label>
              <input
                type="text"
                required
                value={formData.titleAr}
                onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                placeholder="مثال: شاحنات ونقل هيدروليكي ثقيل"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* English Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "اسم المعدة (إنجليزي) *" : "Title (English) *"}
              </label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="e.g. Heavy Transport Trucks & Winches"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Subtitle AR */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "العنوان الفرعي (عربي)" : "Subtitle (Arabic)"}
              </label>
              <input
                type="text"
                value={formData.subtitleAr}
                onChange={e => setFormData({ ...formData, subtitleAr: e.target.value })}
                placeholder="مثال: أسطول نقل مجاني متكامل للشرقية والدمام"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Subtitle EN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "العنوان الفرعي (إنجليزي)" : "Subtitle (English)"}
              </label>
              <input
                type="text"
                value={formData.subtitleEn}
                onChange={e => setFormData({ ...formData, subtitleEn: e.target.value })}
                placeholder="e.g. Complimentary Heavy Scrap Fleet"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Capacity AR */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "السعة / الشارة (عربي)" : "Capacity Badge (Arabic)"}
              </label>
              <input
                type="text"
                value={formData.capacityAr}
                onChange={e => setFormData({ ...formData, capacityAr: e.target.value })}
                placeholder="مثال: حملات تصل إلى 50 طن"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Capacity EN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "السعة / الشارة (إنجليزي)" : "Capacity Badge (English)"}
              </label>
              <input
                type="text"
                value={formData.capacityEn}
                onChange={e => setFormData({ ...formData, capacityEn: e.target.value })}
                placeholder="e.g. Up to 50 Tons Capacity"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Image URL & Selector */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "رابط صورة المعدة" : "Equipment Image URL"}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>{isRtl ? "المكتبة" : "Media"}</span>
                </button>
              </div>
              {formData.image && (
                <div className="mt-2 h-24 w-40 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Description AR */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "الوصف التفصيلي (عربي)" : "Description (Arabic)"}
              </label>
              <textarea
                rows={3}
                value={formData.descriptionAr}
                onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                placeholder="شرح موجز لمهام المعدة واستخداماتها..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Description EN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "الوصف التفصيلي (إنجليزي)" : "Description (English)"}
              </label>
              <textarea
                rows={3}
                value={formData.descriptionEn}
                onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                placeholder="Brief summary of equipment features..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

          </div>

          {/* Specifications Rows */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-300">
                {isRtl ? "المواصفات والنقاط المميزة" : "Specifications & Key Features"}
              </span>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-3 py-1 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? "إضافة خاصية" : "Add Spec"}</span>
              </button>
            </div>

            {(formData.specificationsAr || []).map((specAr, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={specAr}
                  onChange={e => handleSpecChange(idx, e.target.value, 'ar')}
                  placeholder={`خاصية ${idx + 1} (عربي)`}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:border-emerald-500 outline-none"
                />
                <input
                  type="text"
                  value={(formData.specificationsEn || [])[idx] || ''}
                  onChange={e => handleSpecChange(idx, e.target.value, 'en')}
                  placeholder={`Feature ${idx + 1} (English)`}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
            ))}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={e => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span>{isRtl ? "تفعيل وإظهار المعدة في الصفحة الرئيسية" : "Active & Display on Homepage"}</span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {editingId ? (isRtl ? "حفظ التغييرات" : "Save Changes") : (isRtl ? "إضافة المعدة" : "Add Equipment")}
            </button>
          </div>
        </form>
      )}

      {/* List of Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipments.map((item) => (
          <div 
            key={item.id}
            className={`bg-slate-900 border ${item.active ? 'border-slate-800' : 'border-red-500/30 opacity-60'} p-4 rounded-2xl flex flex-col justify-between gap-4 shadow-lg`}
          >
            <div className="flex gap-3">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'} 
                alt={item.titleAr}
                className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white text-sm truncate">{isRtl ? item.titleAr : item.titleEn}</h4>
                  {item.capacityAr && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                      {isRtl ? item.capacityAr : item.capacityEn}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5 truncate">{isRtl ? item.subtitleAr : item.subtitleEn}</p>
                <p className="text-xs text-slate-400 font-medium line-clamp-2 mt-1">{isRtl ? item.descriptionAr : item.descriptionEn}</p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center border-t border-slate-800/80 pt-3">
              <button
                onClick={() => updateEquipment(item.id, { active: !item.active })}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                  item.active 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{item.active ? (isRtl ? 'نشط في الهوم بيج' : 'Active') : (isRtl ? 'معطل' : 'Hidden')}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="تعديل"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(isRtl ? 'هل أنت تأكد من حذف هذه المعدة؟' : 'Delete this equipment?')) {
                      deleteEquipment(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Picker Modal */}
      {isMediaOpen && (
        <MediaLibraryModal
          isOpen={isMediaOpen}
          isRtl={isRtl}
          onClose={() => setIsMediaOpen(false)}
          onSelectImage={(url) => {
            setFormData({ ...formData, image: url });
            setIsMediaOpen(false);
          }}
        />
      )}

    </div>
  );
}
