import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Users as UsersIcon, Shield, Ban, CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { userApi } from '../api/user';

const Users = () => {
    const { t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
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

    const handleSearch = (e) => { e.preventDefault(); fetchUsers(searchTerm); };

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
        if (window.confirm('Delete this user?')) {
            try { await userApi.delete(id); setUsers(prev => prev.filter(u => u.id !== id)); } catch { alert('Failed to delete user'); }
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div></div>;

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-slate-800">{t('sidebar.users')}</h1><p className="text-sm text-slate-500">Manage system users and roles</p></div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition shadow-sm"><Plus size={18} /> Add User</button>
            </div>
            <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                <button type="submit" className="ml-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"><Search size={18} /></button>
            </form>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full">
                    <thead><tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.length === 0 ? (<tr><td colSpan="5" className="px-5 py-12 text-center"><UsersIcon size={32} className="mx-auto text-slate-300 mb-2" /><p className="text-sm text-slate-400">No users found</p></td></tr>) : users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold">{u.name?.charAt(0)}</div>
                                        <div><p className="text-sm font-medium text-slate-800">{u.name}</p>{u.last_login_at && <p className="text-[10px] text-slate-400">Last login: {new Date(u.last_login_at).toLocaleDateString('id-ID')}</p>}</div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5"><p className="text-sm text-slate-600">{u.email}</p></td>
                                <td className="px-5 py-3.5">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-700">
                                        <Shield size={10} /> {u.roles?.[0]?.name || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 text-center">
                                    {u.is_active ? (
                                        <CheckCircle size={16} className="text-emerald-500 inline" />
                                    ) : (
                                        <Ban size={16} className="text-red-400 inline" />
                                    )}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition ml-1"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
                <div className="flex justify-between items-center mb-5"><h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit User' : 'Add User'}</h2><button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"><X size={18} /></button></div>
                {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{formError}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={editing} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">{editing ? 'Password (leave empty to keep)' : 'Password *'}</label><input type="password" value={form.password} onChange={(e) => setForm(f => ({...f, password: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required={!editing} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label><select value={form.role} onChange={(e) => setForm(f => ({...f, role: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"><option value="admin">Admin</option><option value="cashier">Cashier</option></select></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-sm">{submitting ? 'Saving...' : 'Save'}</button></div>
                </form>
            </div></div>)}
        </div>
    );
};

export default Users;
