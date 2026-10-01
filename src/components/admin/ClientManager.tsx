import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit, CheckCircle2, Building, ShieldCheck, Phone, MapPin, Search } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { ClientItem } from '../../cms/types';
import ImageUploader from './ImageUploader';

interface ClientManagerProps {
  lang: 'ar' | 'en';
}

export default function ClientManager({ lang }: ClientManagerProps) {
  const { cmsData, addClient, updateClient, deleteClient } = useCMS();
  const isRtl = lang === 'ar';

  const clients = cmsData.clients || [];
  const [activeTab, setActiveTab] = useState<'all' | 'new_lead' | 'active' | 'vip'>('all');
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(c => {
    const matchesTab = activeTab === 'all' || c.status === activeTab;
    const matchesSearch = 
      c.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery));
    return matchesTab && matchesSearch;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    if (isCreating) {
      addClient(editingClient);
    } else {
      updateClient(editingClient.id, editingClient);
    }

    setEditingClient(null);
    setIsCreating(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const startCreateNew = (status: 'active' | 'new_lead' = 'active') => {
    setEditingClient({
      id: '',
      nameAr: status === 'new_lead' ? 'شركة جديدة (طلب انضمام)' : 'شركة الخليج للمقاولات',
      nameEn: status === 'new_lead' ? 'New Lead Corporate' : 'Gulf Contracting Co',
      logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
      type: 'corporate',
      status: status,
      companyRegNumber: '2050000000',
      phone: '0500000000',
      location: 'الدمام - المنطقة الشرقية',
      totalTransactions: '50,000 ر.س',
      dateAdded: new Date().toISOString().split('T')[0],
      notes: 'عميل جديد تم تسجيله في النظام'
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <span>{isRtl ? "إدارة العملاء والشركات (Clients Management)" : "Client & Corporate Management"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "متابعة جميع العملاء والشركات المتعامل معها ومتابعة طلبات الانضمام الجديدة" 
              : "Track corporate partners, factories, and manage new client lead inquiries"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startCreateNew('active')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? "إضافة عميل/شركة" : "Add Client"}</span>
          </button>

          <button
            onClick={() => startCreateNew('new_lead')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? "طلب انضمام جديد (New Lead)" : "New Lead Request"}</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{isRtl ? "تم حفظ بيانات العميل بنجاح!" : "Client saved successfully!"}</span>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
              activeTab === 'all' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? "جميع العملاء (All Clients)" : "All Clients"} ({clients.length})
          </button>

          <button
            onClick={() => setActiveTab('new_lead')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'new_lead' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <span>{isRtl ? "العملاء الجدد (New Leads)" : "New Leads"}</span>
            <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full text-[10px]">
              {clients.filter(c => c.status === 'new_lead').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vip')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
              activeTab === 'vip' ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {isRtl ? "عملاء كبار VIP" : "VIP Corporate"}
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? "بحث باسم العميل أو الهاتف..." : "Search client name/phone..."}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Edit / Create Form Modal */}
      {editingClient && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>
                {isCreating ? (isRtl ? "إضافة عميل أو شركة جديدة" : "Add New Client") : (isRtl ? `تعديل بيانات: ${editingClient.nameAr}` : `Edit Client: ${editingClient.nameEn}`)}
              </span>
            </h2>
            <button
              onClick={() => { setEditingClient(null); setIsCreating(false); }}
              className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-3 py-1 rounded-lg cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "اسم العميل / الشركة (عربي)" : "Client Name (Arabic)"}
                </label>
                <input
                  type="text"
                  value={editingClient.nameAr}
                  onChange={(e) => setEditingClient({ ...editingClient, nameAr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "اسم العميل / الشركة (إنجليزي)" : "Client Name (English)"}
                </label>
                <input
                  type="text"
                  value={editingClient.nameEn}
                  onChange={(e) => setEditingClient({ ...editingClient, nameEn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "حالة العميل" : "Client Status"}
                </label>
                <select
                  value={editingClient.status}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                >
                  <option value="active">{isRtl ? "نشط (Active Client)" : "Active Client"}</option>
                  <option value="new_lead">{isRtl ? "طلب جديد (New Lead)" : "New Lead Request"}</option>
                  <option value="vip">{isRtl ? "عميل مميز (VIP Corporate)" : "VIP Corporate"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "تصنيف النشاط" : "Entity Type"}
                </label>
                <select
                  value={editingClient.type}
                  onChange={(e) => setEditingClient({ ...editingClient, type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                >
                  <option value="corporate">{isRtl ? "شركة مقاولات" : "Contracting Corporate"}</option>
                  <option value="factory">{isRtl ? "مصنع / هيئة صناعية" : "Factory / Industrial"}</option>
                  <option value="contractor">{isRtl ? "مقاول سكراب" : "Scrap Contractor"}</option>
                  <option value="individual">{isRtl ? "عميل فردي" : "Individual"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "رقم الجوال / الواتساب" : "Phone / WhatsApp"}
                </label>
                <input
                  type="text"
                  value={editingClient.phone || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الموقع / المدينة" : "Location / City"}
                </label>
                <input
                  type="text"
                  value={editingClient.location || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs"
                />
              </div>
            </div>

            <ImageUploader
              label={isRtl ? "شعار الشركة (Logo)" : "Company Logo"}
              value={editingClient.logoUrl}
              onChange={(url) => setEditingClient({ ...editingClient, logoUrl: url })}
              isRtl={isRtl}
            />

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isRtl ? "ملاحظات وتاريخ التعاملات" : "Notes & Deal Details"}
              </label>
              <textarea
                value={editingClient.notes || ''}
                onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setEditingClient(null); setIsCreating(false); }}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                {isRtl ? "حفظ العميل" : "Save Client"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={client.logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80'} 
                  alt={client.nameAr}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-black text-white text-sm truncate">
                      {isRtl ? client.nameAr : client.nameEn}
                    </h3>
                    <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full ${
                      client.status === 'vip' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      client.status === 'new_lead' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {client.status === 'vip' ? 'VIP' : client.status === 'new_lead' ? (isRtl ? 'طلب جديد' : 'New Lead') : (isRtl ? 'نشط' : 'Active')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {client.phone && <span className="dir-ltr font-mono">{client.phone}</span>}
                  </p>
                </div>
              </div>

              {client.notes && (
                <p className="text-slate-400 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                  {client.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">
                {isRtl ? `تاريخ الإضافة: ${client.dateAdded}` : `Added: ${client.dateAdded}`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingClient(client); setIsCreating(false); }}
                  className="p-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-lg cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(isRtl ? "هل أنت تأكد من حذف هذا العميل؟" : "Delete this client?")) {
                      deleteClient(client.id);
                    }
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
