import React, { useState } from 'react';
import { MessageSquare, PhoneCall, CheckCircle, Clock, Trash2, Search, Filter, ShieldCheck } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';

interface InquiryManagerProps {
  lang: 'ar' | 'en';
}

export default function InquiryManager({ lang }: InquiryManagerProps) {
  const { cmsData, updateInquiryStatus, deleteInquiry } = useCMS();
  const isRtl = lang === 'ar';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredInquiries = cmsData.inquiries.filter((inq) => {
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.materialType && inq.materialType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-400" />
            <span>{isRtl ? "طلبات التسعير ورسائل العملاء (Inquiries & Leads)" : "Customer Inquiries & Quotes"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "استلام ومتابعة طلبات شراء السكراب والمكيفات المرسلة من استمارة التواصل بالموقع" 
              : "Track scrap quote requests and client leads sent via the contact form"}
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        
        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All', count: cmsData.inquiries.length },
            { id: 'new', labelAr: 'طلبات جديدة', labelEn: 'New', count: cmsData.inquiries.filter(i => i.status === 'new').length },
            { id: 'contacted', labelAr: 'تم التواصل', labelEn: 'Contacted', count: cmsData.inquiries.filter(i => i.status === 'contacted').length },
            { id: 'completed', labelAr: 'مكتملة', labelEn: 'Completed', count: cmsData.inquiries.filter(i => i.status === 'completed').length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterStatus === item.id 
                  ? 'bg-emerald-500 text-slate-950 shadow-md' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{isRtl ? item.labelAr : item.labelEn}</span>
              <span className="bg-slate-900/80 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2.5 right-3 ltr:right-auto ltr:left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "البحث برقم الهاتف أو الاسم..." : "Search name or phone..."}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-8 text-white text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Leads Cards */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            {isRtl ? "لا توجد طلبات تسعير مطابقة للفلتر" : "No inquiries match your criteria"}
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div 
              key={inq.id} 
              className={`bg-slate-900 border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                inq.status === 'new' ? 'border-teal-500/40 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-sm">{inq.name}</span>
                  <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {inq.phone}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    inq.status === 'new' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    inq.status === 'contacted' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-emerald-400">{isRtl ? "نوع السكراب:" : "Material:"}</strong> {inq.materialType || 'غير محدد'} | 
                  <strong className="text-cyan-400 ml-2">{isRtl ? " الموقع:" : " Location:"}</strong> {inq.location || 'الدمام'}
                </div>

                {inq.estimatedWeight && (
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">{isRtl ? "الكمية والوزن:" : "Weight:"}</strong> {inq.estimatedWeight}
                  </p>
                )}

                {inq.notes && (
                  <p className="text-xs text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800/80 mt-1 max-w-xl">
                    "{inq.notes}"
                  </p>
                )}

                <span className="text-[10px] text-slate-500 block pt-1">{inq.createdAt}</span>
              </div>

              {/* Status & Contact Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto justify-end">
                <select
                  value={inq.status}
                  onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:border-emerald-500"
                >
                  <option value="new">{isRtl ? "جديد" : "New"}</option>
                  <option value="contacted">{isRtl ? "تم التواصل" : "Contacted"}</option>
                  <option value="completed">{isRtl ? "مكتمل" : "Completed"}</option>
                </select>

                <a
                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، معك مؤسسة شيرا لشراء السكراب بالدمام رداً على طلب التسعيرة الخاص بك.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isRtl ? "رد بالواتساب" : "WhatsApp"}</span>
                </a>

                <button
                  onClick={() => deleteInquiry(inq.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-xl border border-red-500/20 transition-colors cursor-pointer"
                  title="حذف الطلب"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
