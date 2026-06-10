import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Users as UsersIcon, Shield, Ban, CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";
import { userApi } from '../api/user';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const Users = () => {
    const { t, locale } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const { isDemo } = useAuth();
    const { showToast } = useToast();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'cashier' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const res = await userApi.getAll({ search, per_page: 50 });
            setUsers(res.data.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSearch = (value) => {
        setSearchTerm(value);
        fetchUsers(value);
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', email: '', password: '', phone: '', role: 'cashier' });
        setFormError(null);
        setShowModal(true);
    };

    const openEdit = (u) => {
        setEditing(u);
        setForm({ name: u.name, email: u.email, password: '', phone: u.phone || '', role: u.roles?.[0]?.name || 'cashier' });
        setFormError(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDemo) {
            showToast('warning');
            return;
        }
        setSubmitting(true);
        setFormError(null);
        try {
            if (editing) {
                const data = { ...form };
                if (!data.password) delete data.password;
                await userApi.update(editing.id, data);
            } else {
                await userApi.create(form);
            }
            setShowModal(false);
            fetchUsers(searchTerm);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm('Delete this user?')) {
            try { await userApi.delete(id); setUsers(prev => prev.filter(u => u.id !== id)); } catch { alert('Failed to delete user'); }
        }
    };

    if (loading) return (
        <div className="space-y-6">
            <PageHeader title={t('sidebar.users')} subtitle="Kelola pengguna dan role sistem" />
            <LoadingSpinner text="Memuat pengguna..." />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('sidebar.users')}
                subtitle="Kelola pengguna dan role sistem"
                action={true}
                actionLabel="Tambah Pengguna"
                actionIcon={Plus}
                onAction={openCreate}
            />

            {/* Search */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 h-10 bg-white dark:bg-surface-raised border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <p className="text-[14px] font-medium text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] overflow-hidden shadow-sm">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02]">
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Name</th>
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Email</th>
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Role</th>
                            <th className="px-5 py-3.5 text-center text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Status</th>
                            <th className="px-5 py-3.5 text-right text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70 dark:divide-white/[0.04]">
                        {users.length === 0 ? (<tr><td colSpan="5" className="px-5 py-16 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                                <UsersIcon size={28} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-[15px] font-semibold text-slate-500 dark:text-slate-400">No users found</p>
                        </td></tr>) : users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-700 dark:text-primary-300 text-[15px] font-bold shrink-0">{u.name?.charAt(0)?.toUpperCase()}</div>
                                        <div><p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{u.name}</p>{u.last_login_at && <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">Last login: {new Date(u.last_login_at).toLocaleDateString('id-ID')}</p>}</div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5"><p className="text-[14px] text-slate-600 dark:text-slate-400">{u.email}</p></td>
                                <td className="px-5 py-3.5">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400">
                                        <Shield size={12} /> {u.roles?.[0]?.name || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 text-center">
                                    {u.is_active ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle size={13} /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                            <Ban size={13} /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                                        <button onClick={() => openEdit(u)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all" title="Edit"><Edit size={15} /></button>
                                        <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" title="Hapus"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-surface-raised rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">{editing ? 'Edit User' : 'Tambah Pengguna'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"><X size={18} /></button>
                        </div>
                        {formError && (
                            <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
                                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </div>
                                <p className="text-[14px] font-medium text-red-700 dark:text-red-400">{formError}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email *</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" required disabled={editing} /></div>
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{editing ? 'Password (leave empty to keep)' : 'Password *'}</label><input type="password" value={form.password} onChange={(e) => setForm(f => ({...f, password: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" required={!editing} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label><select value={form.role} onChange={(e) => setForm(f => ({...f, role: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"><option value="admin">Admin</option><option value="cashier">Cashier</option></select></div>
                            </div>
                            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-[14px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.06] rounded-xl hover:bg-slate-200 dark:hover:bg-white/[0.10] transition-all">Cancel</button>
                                <button type="submit" disabled={submitting || isDemo} className="px-5 py-2.5 text-[14px] font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-all shadow-sm shadow-primary-500/20 active:scale-[0.97]">{submitting ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
