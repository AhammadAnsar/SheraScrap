import React, { useState } from 'react';
import { Quote, Plus, Trash2, Edit, Save, CheckCircle2, Star, ShieldCheck } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { TestimonialEntry } from '../../cms/types';

interface TestimonialManagerProps {
  lang: 'ar' | 'en';
}

export default function TestimonialManager({ lang }: TestimonialManagerProps) {
  const { cmsData, addTestimonial, updateTestimonial, deleteTestimonial } = useCMS();
  const isRtl = lang === 'ar';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TestimonialEntry>>({});
  const [savedNotice, setSavedNotice] = useState(false);

  const testimonialsList = cmsData.testimonials || [];

  const handleEdit = (test: TestimonialEntry) => {
    setEditingId(test.id);
    setFormData(test);
  };

  const handleCreate = () => {
    const today = new Date().toISOString().split('T')[0];
    const newTest: TestimonialEntry = {
      id: `test-${Date.now()}`,
      nameAr: 'اسم العميل التقديري',
      nameEn: 'Customer Name',
      locationAr: 'الدمام - حي الفيصلية',
      locationEn: 'Dammam - Al Faisaliyah',
      rating: 5,
      textAr: 'رأي العميل المميز وتقييمه لخدمة شراء السكراب والسرعة والتسليم كاش...',
      textEn: 'Customer review about scrap purchasing, speed and instant cash payment...',
      date: today,
      verified: true
    };
    setEditingId(newTest.id);
    setFormData(newTest);
  };

  const handleSave = () => {
    if (!editingId) return;

    const exists = testimonialsList.some(t => t.id === editingId);
    if (exists) {
      updateTestimonial(editingId, formData);
    } else {
      addTestimonial({
        nameAr: formData.nameAr || 'عميل بالدمام',
        nameEn: formData.nameEn || 'Dammam Customer',
        locationAr: formData.locationAr || 'الدمام والشرقية',
        locationEn: formData.locationEn || 'Dammam & Eastern Province',
        rating: formData.rating || 5,
        textAr: formData.textAr || '',
        textEn: formData.textEn || '',
        date: formData.date || new Date().toISOString().split('T')[0],
        verified: formData.verified ?? true
      });
    }

    setEditingId(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this review?')) {
      deleteTestimonial(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? 'إدارة آراء وتقييمات العملاء (Edit Testimonials)' : 'Testimonials Management'}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl ? 'إضافة وتعديل وحذف تجارب العملاء المعروضة بالصفحة الرئيسية وتحديثها في قاعدة البيانات فوراً' : 'Add, edit or remove customer reviews displayed on the homepage with live Firestore sync'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة رأي عميل جديد' : 'Add New Review'}</span>
        </button>
      </div>

      {savedNotice && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'تم حفظ التقييمات وتحديث الواجهة الرئيسية في قاعدة البيانات بنجاح!' : 'Testimonials updated and synchronized successfully!'}</span>
        </div>
      )}

      {/* Editor Modal / Inline Form */}
      {editingId && (
        <div className="bg-slate-900 border border-slate-700/80 p-5 rounded-2xl space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <Edit className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'تعديل بيانات تقييم العميل' : 'Edit Customer Review'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'اسم العميل بالعربية' : 'Customer Name (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.nameAr || ''}
                onChange={e => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                placeholder="مثال: أبو عبد الله الدوسري"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'اسم العميل بالإنجليزية' : 'Customer Name (English)'}
              </label>
              <input
                type="text"
                value={formData.nameEn || ''}
                onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                placeholder="Abu Abdullah Al-Dossary"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'الموقع أو الحي بالعربية' : 'Location (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.locationAr || ''}
                onChange={e => setFormData(prev => ({ ...prev, locationAr: e.target.value }))}
                placeholder="مثال: الدمام - حي النزهة"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'الموقع أو الحي بالإنجليزية' : 'Location (English)'}
              </label>
              <input
                type="text"
                value={formData.locationEn || ''}
                onChange={e => setFormData(prev => ({ ...prev, locationEn: e.target.value }))}
                placeholder="Dammam - Al Nuzha"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'التقييم (عدد النجوم 1-5)' : 'Rating (1-5 Stars)'}
              </label>
              <select
                value={formData.rating || 5}
                onChange={e => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={5}>5 ⭐⭐⭐⭐⭐ (ممتاز جداً)</option>
                <option value={4}>4 ⭐⭐⭐⭐ (جيد جداً)</option>
                <option value={3}>3 ⭐⭐⭐ (جيد)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'تاريخ التقييم' : 'Review Date'}
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'نص التقييم بالعربية' : 'Review Text (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={formData.textAr || ''}
                onChange={e => setFormData(prev => ({ ...prev, textAr: e.target.value }))}
                placeholder="اكتب تجربة العميل بالتفصيل..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'نص التقييم بالإنجليزية' : 'Review Text (English)'}
              </label>
              <textarea
                rows={3}
                value={formData.textEn || ''}
                onChange={e => setFormData(prev => ({ ...prev, textEn: e.target.value }))}
                placeholder="Write customer feedback in English..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ التقييم' : 'Save Review'}</span>
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonialsList.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
            {isRtl ? 'لا توجد آراء عملاء مسجلة حتى الآن. انقر على "إضافة رأي عميل جديد" للبدء.' : 'No testimonials recorded yet. Click "Add New Review" to begin.'}
          </div>
        ) : (
          testimonialsList.map((test) => (
            <div
              key={test.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{test.date}</span>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3">
                  "{isRtl ? test.textAr : test.textEn}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {isRtl ? test.nameAr : test.nameEn}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isRtl ? test.locationAr : test.locationEn}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(test)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
                    title={isRtl ? 'تعديل' : 'Edit'}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-xs cursor-pointer"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
