import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Users as UsersIcon, Shield, Ban, CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";
import { userApi } from '../api/user';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const Users = () => {
    const { t } = useLanguage();
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

            {/* Search — debounced */}
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-9 pr-4 h-9 bg-surface dark:bg-surface-raised border border-slate-200 dark:border-white/[0.12] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors placeholder:text-slate-400 dark:placeholder-slate-500"
                />
            </div>

            {error && <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">{error}</div>}

            <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Role</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                        {users.length === 0 ? (<tr><td colSpan="5" className="px-4 py-12 text-center"><UsersIcon size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" /><p className="text-sm text-slate-400 dark:text-slate-500">No users found</p></td></tr>) : users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-semibold">{u.name?.charAt(0)}</div>
                                        <div><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{u.name}</p>{u.last_login_at && <p className="text-[10px] text-slate-400 dark:text-slate-500">Last login: {new Date(u.last_login_at).toLocaleDateString('id-ID')}</p>}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3"><p className="text-sm text-slate-600 dark:text-slate-400">{u.email}</p></td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                                        <Shield size={10} /> {u.roles?.[0]?.name || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {u.is_active ? (
                                        <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400 inline" />
                                    ) : (
                                        <Ban size={16} className="text-red-400 dark:text-red-400 inline" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"><Edit size={14} /></button>
                                    <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ml-1"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{editing ? 'Edit User' : 'Tambah Pengguna'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"><X size={18} /></button>
                        </div>
                        {formError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required disabled={editing} /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{editing ? 'Password (leave empty to keep)' : 'Password *'}</label><input type="password" value={form.password} onChange={(e) => setForm(f => ({...f, password: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required={!editing} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label><select value={form.role} onChange={(e) => setForm(f => ({...f, role: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"><option value="admin">Admin</option><option value="cashier">Cashier</option></select></div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">Cancel</button>
                                <button type="submit" disabled={submitting || isDemo} className="px-4 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-all shadow-sm">{submitting ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
