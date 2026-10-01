import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Edit, Save, CheckCircle2, Eye, X, Banknote, Truck, Scale, Clock, Award } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { WhyUsFeature } from '../../cms/types';

interface WhyUsManagerProps {
  lang: 'ar' | 'en';
}

export default function WhyUsManager({ lang }: WhyUsManagerProps) {
  const { cmsData, setCmsData } = useCMS();
  const isRtl = lang === 'ar';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WhyUsFeature>>({});
  const [savedNotice, setSavedNotice] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const features = cmsData.whyUsFeatures || [];

  const handleEdit = (feat: WhyUsFeature) => {
    setEditingId(feat.id);
    setFormData(feat);
  };

  const handleCreate = () => {
    const newFeat: WhyUsFeature = {
      id: `why-${Date.now()}`,
      titleAr: 'ميزة جديدة...',
      titleEn: 'New Advantage...',
      descAr: 'وصف تفصيلي للميزة أو الخدمة المقدمة للعملاء...',
      descEn: 'Detailed advantage description...',
      iconName: 'ShieldCheck',
      order: features.length + 1,
      active: true
    };
    setEditingId(newFeat.id);
    setFormData(newFeat);
  };

  const handleSave = () => {
    if (!editingId) return;

    setCmsData(prev => {
      const existingList = prev.whyUsFeatures || [];
      const exists = existingList.some(f => f.id === editingId);
      let updated: WhyUsFeature[];
      if (exists) {
        updated = existingList.map(f => f.id === editingId ? { ...f, ...formData } as WhyUsFeature : f);
      } else {
        updated = [...existingList, formData as WhyUsFeature];
      }
      return { ...prev, whyUsFeatures: updated };
    });

    setEditingId(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm(isRtl ? 'هل أنت تأكد من حذف هذه الميزة؟' : 'Are you sure you want to delete this feature?')) {
      setCmsData(prev => ({
        ...prev,
        whyUsFeatures: (prev.whyUsFeatures || []).filter(f => f.id !== id)
      }));
    }
  };

  // Helper function to render icon dynamically
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Banknote': return <Banknote className="w-6 h-6 text-emerald-600" />;
      case 'Truck': return <Truck className="w-6 h-6 text-emerald-600" />;
      case 'Scale': return <Scale className="w-6 h-6 text-emerald-600" />;
      case 'Clock': return <Clock className="w-6 h-6 text-emerald-600" />;
      default: return <Award className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? 'إدارة قسم "لماذا نحن" (Why Choose Us)' : 'Why Choose Us Management'}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl ? 'التحكم في ميزات الضمان والسرعة والسعر الكاش المعروضة بالصفحة الرئيسية' : 'Manage key trust advantages and highlights on the homepage'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{isRtl ? 'معاينة التغييرات' : 'Preview Changes'}</span>
          </button>

          <button
            onClick={handleCreate}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة ميزة جديدة' : 'Add New Feature'}</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'تم حفظ وتحديث ميزات الشركة بنجاح!' : 'Why Choose Us features updated successfully!'}</span>
        </div>
      )}

      {/* Editor Panel */}
      {editingId && (
        <div className="bg-slate-900 border border-slate-700/80 p-5 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-sm font-black text-white border-b border-slate-800 pb-2">
            {isRtl ? 'تعديل بيانات الميزة' : 'Edit Feature'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'عنوان الميزة بالعربية' : 'Title (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.titleAr || ''}
                onChange={e => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'عنوان الميزة بالإنجليزية' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={formData.titleEn || ''}
                onChange={e => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'وصف الميزة بالعربية' : 'Description (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={formData.descAr || ''}
                onChange={e => setFormData(prev => ({ ...prev, descAr: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'وصف الميزة بالإنجليزية' : 'Description (English)'}
              </label>
              <textarea
                rows={3}
                value={formData.descEn || ''}
                onChange={e => setFormData(prev => ({ ...prev, descEn: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ الميزة' : 'Save Feature'}</span>
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat) => (
          <div
            key={feat.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">
                {isRtl ? feat.titleAr : feat.titleEn}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(feat)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(feat.id)}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl ? feat.descAr : feat.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-black text-white">
                  {isRtl ? 'معاينة حية: قسم لماذا تختار مؤسسة شيرا للسكراب؟' : 'Live Preview: Why Choose Us Section'}
                </h2>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Homepage Section */}
            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-3xl p-8 space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {isRtl ? 'معاينة الشكل المباشر للزائر' : 'Homepage Live Preview'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {isRtl ? 'لماذا نعتبر الخيار الأول لشراء السكراب بالدمام والشرقية؟' : 'Why We Are The #1 Choice in Dammam'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feat) => (
                  <div
                    key={feat.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                      {getIcon(feat.iconName)}
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isRtl ? feat.titleAr : feat.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {isRtl ? feat.descAr : feat.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                {isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
