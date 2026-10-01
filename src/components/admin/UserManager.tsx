import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, Mail, UserCheck, X, KeyRound, Sparkles } from 'lucide-react';
import { useCMS } from '../../cms/CMSContext';
import { AdminUser } from '../../cms/types';

interface UserManagerProps {
  lang: 'ar' | 'en';
}

export default function UserManager({ lang }: UserManagerProps) {
  const { cmsData, addUser, updateUser, deleteUser, currentUser } = useCMS();
  const isRtl = lang === 'ar';

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingUser({
      id: '',
      username: 'editor_' + Date.now().toString().slice(-4),
      password: '',
      name: 'محرر جديد',
      email: 'editor@sherascrap.com',
      role: 'editor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (usr: AdminUser) => {
    setEditingUser(usr);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (editingUser.id) {
      updateUser(editingUser.id, editingUser);
    } else {
      addUser(editingUser);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>{isRtl ? "إدارة المستخدمين والأدمن (User Management)" : "User & Role Management"}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {isRtl 
              ? "إضافة مدراء ومحررين للوحة التحكم وتحديد الصلاحيات للوحة CMS" 
              : "Manage admin team accounts, assign roles, and access controls"}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? "إضافة مدير/محرر جديد" : "Add Admin Account"}</span>
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cmsData.users.map((usr) => (
          <div key={usr.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <img src={usr.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'} alt={usr.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-800 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">{usr.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${
                    usr.role === 'super_admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {usr.role === 'super_admin' ? (isRtl ? 'مدير عام' : 'Super Admin') : (isRtl ? 'محرر محتوى' : 'Editor')}
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-mono mt-0.5">{usr.email}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Username: @{usr.username}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                {isRtl ? 'تاريخ الإنشاء: ' : 'Created: '} {usr.createdAt}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(usr)}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-400 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {usr.id !== currentUser?.id && (
                  <button
                    onClick={() => deleteUser(usr.id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit/Add User */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{editingUser.id ? (isRtl ? "تعديل حساب المستخدم" : "Edit Account") : (isRtl ? "إضافة حساب جديد" : "New Account")}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "اسم المستخدم (Username)" : "Username"}
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <p className="text-xs text-slate-400">{isRtl ? 'تدار كلمات المرور والتحقق من البريد في Firebase Authentication.' : 'Passwords and email verification are managed in Firebase Authentication. This form controls CMS access only.'}</p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isRtl ? "الصلاحية (Role)" : "Role"}
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                >
                  <option value="super_admin">{isRtl ? "مدير عام (Super Admin)" : "Super Admin"}</option>
                  <option value="editor">{isRtl ? "محرر محتوى (Editor)" : "Editor"}</option>
                  <option value="moderator">{isRtl ? "مشرف طلبات (Moderator)" : "Moderator"}</option>
                </select>
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
                  {isRtl ? "حفظ الحساب" : "Save Account"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
