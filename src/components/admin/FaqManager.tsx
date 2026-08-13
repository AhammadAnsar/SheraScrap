import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, Edit, Save, CheckCircle2, Eye, X, ChevronDown } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { FAQEntry } from '../../cms/types';

interface FaqManagerProps {
  lang: 'ar' | 'en';
}

export default function FaqManager({ lang }: FaqManagerProps) {
  const { cmsData, setCmsData } = useCMS();
  const isRtl = lang === 'ar';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FAQEntry>>({});
  const [savedNotice, setSavedNotice] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = cmsData.faqs || [];

  const handleEdit = (faq: FAQEntry) => {
    setEditingId(faq.id);
    setFormData(faq);
  };

  const handleCreate = () => {
    const newFaq: FAQEntry = {
      id: `faq-${Date.now()}`,
      questionAr: 'سؤال جديد...',
      questionEn: 'New Question...',
      answerAr: 'إجابة السؤال التفصيلية...',
      answerEn: 'Detailed answer...',
      order: faqs.length + 1
    };
    setEditingId(newFaq.id);
    setFormData(newFaq);
  };

  const handleSave = () => {
    if (!editingId) return;

    setCmsData(prev => {
      const exists = prev.faqs.some(f => f.id === editingId);
      let updatedFaqs: FAQEntry[];
      if (exists) {
        updatedFaqs = prev.faqs.map(f => f.id === editingId ? { ...f, ...formData } as FAQEntry : f);
      } else {
        updatedFaqs = [...prev.faqs, formData as FAQEntry];
      }
      return { ...prev, faqs: updatedFaqs };
    });

    setEditingId(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm(isRtl ? 'هل أنت تأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this FAQ?')) {
      setCmsData(prev => ({
        ...prev,
        faqs: prev.faqs.filter(f => f.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? 'إدارة الأسئلة الشائعة (FAQ Management)' : 'FAQ Management'}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl ? 'إضافة وتعديل الأسئلة والأجوبة الشائعة التي تظهر للزوار بالموقع' : 'Manage FAQ items and answers displayed on the website'}
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
            <span>{isRtl ? 'إضافة سؤال جديد' : 'Add New FAQ'}</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? 'تم حفظ الأسئلة الشائعة وتحديثها في الموقع والسيرفر!' : 'FAQ saved successfully!'}</span>
        </div>
      )}

      {/* Editor Modal / Inline Form */}
      {editingId && (
        <div className="bg-slate-900 border border-slate-700/80 p-5 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-sm font-black text-white border-b border-slate-800 pb-2">
            {isRtl ? 'تعديل بيانات السؤال' : 'Edit FAQ Content'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'السؤال بالعربية' : 'Question (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.questionAr || ''}
                onChange={e => setFormData(prev => ({ ...prev, questionAr: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'السؤال بالإنجليزية' : 'Question (English)'}
              </label>
              <input
                type="text"
                value={formData.questionEn || ''}
                onChange={e => setFormData(prev => ({ ...prev, questionEn: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'الإجابة التفصيلية بالعربية' : 'Answer (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={formData.answerAr || ''}
                onChange={e => setFormData(prev => ({ ...prev, answerAr: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? 'الإجابة التفصيلية بالإنجليزية' : 'Answer (English)'}
              </label>
              <textarea
                rows={3}
                value={formData.answerEn || ''}
                onChange={e => setFormData(prev => ({ ...prev, answerEn: e.target.value }))}
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
              <span>{isRtl ? 'حفظ التغييرات' : 'Save FAQ'}</span>
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

      {/* List of FAQs */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-1 overflow-hidden">
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                FAQ #{index + 1}
              </span>
              <h3 className="text-sm font-bold text-white truncate">
                {isRtl ? faq.questionAr : faq.questionEn}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">
                {isRtl ? faq.answerAr : faq.answerEn}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(faq)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs cursor-pointer"
                title="تعديل"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-black text-white">
                  {isRtl ? 'معاينة حية: قسم الأسئلة الشائعة (FAQ)' : 'Live Preview: FAQ Accordion Section'}
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
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {isRtl ? 'معاينة قسم الأكورديون المباشر' : 'Live Accordion Preview'}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {isRtl ? 'الأسئلة الشائعة حول شراء السكراب بالدمام' : 'Frequently Asked Questions'}
                </h2>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/60"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm hover:text-emerald-500 cursor-pointer"
                      >
                        <span>{isRtl ? faq.questionAr : faq.questionEn}</span>
                        <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800 pt-3">
                          {isRtl ? faq.answerAr : faq.answerEn}
                        </div>
                      )}
                    </div>
                  );
                })}
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
