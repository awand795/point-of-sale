import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Building, Mail, Phone, Briefcase } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useSuppliers } from '../hooks/useSuppliers';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const Suppliers = () => {
    const { t } = useLanguage();
    const { suppliers, loading, error, createSupplier, updateSupplier, deleteSupplier, searchSuppliers, pagination, goToPage } = useSuppliers();
    const { isDemo } = useAuth();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', address: '', tax_id: '', notes: '' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = (value) => {
        setSearchTerm(value);
        searchSuppliers(value);
    };

    const openCreate = () => { setEditing(null); setForm({ name: '', company: '', email: '', phone: '', address: '', tax_id: '', notes: '' }); setFormError(null); setShowModal(true); };
    const openEdit = (s) => { setEditing(s); setForm({ name: s.name || '', company: s.company || '', email: s.email || '', phone: s.phone || '', address: s.address || '', tax_id: s.tax_id || '', notes: s.notes || '' }); setFormError(null); setShowModal(true); };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDemo) {
            showToast('warning');
            return;
        }
        setSubmitting(true); setFormError(null);
        try { if (editing) { await updateSupplier(editing.id, form); } else { await createSupplier(form); } setShowModal(false); }
        catch (err) { setFormError(err.response?.data?.message || 'Failed to save supplier'); } finally { setSubmitting(false); }
    };
    const handleDelete = async (id) => {
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm('Delete this supplier?')) { try { await deleteSupplier(id); } catch { alert('Failed to delete supplier'); } }
    };

    if (loading) return (
        <div className="space-y-6">
            <PageHeader title={t('sidebar.suppliers')} subtitle="Manage your suppliers and vendors" />
            <LoadingSpinner text="Memuat supplier..." />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('sidebar.suppliers')}
                subtitle="Manage your suppliers and vendors"
                action={true}
                actionLabel="Add Supplier"
                actionIcon={Plus}
                onAction={openCreate}
            />

            {/* Search — debounced */}
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search suppliers..."
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Tax ID</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                        {suppliers.length === 0 ? (<tr><td colSpan="4" className="px-4 py-12 text-center"><Building size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" /><p className="text-sm text-slate-400 dark:text-slate-500">No suppliers found</p></td></tr>) : suppliers.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-semibold">{s.name?.charAt(0)}</div>
                                        <div><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.name}</p>{s.company && <p className="text-xs text-slate-400 dark:text-slate-500"><Briefcase size={10} className="inline mr-1" />{s.company}</p>}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="space-y-0.5">{s.email && <p className="text-xs text-slate-500 dark:text-slate-400"><Mail size={12} className="inline mr-1" />{s.email}</p>}{s.phone && <p className="text-xs text-slate-500 dark:text-slate-400"><Phone size={12} className="inline mr-1" />{s.phone}</p>}</div>
                                </td>
                                <td className="px-4 py-3"><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{s.tax_id || '-'}</p></td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"><Edit size={14} /></button>
                                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ml-1"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination?.last_page > 1 && (
                <div className="flex justify-center gap-1">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all ${
                                pagination.current_page === page
                                    ? 'bg-primary-500 text-white'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{editing ? 'Edit Supplier' : 'Add Supplier'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"><X size={18} /></button>
                        </div>
                        {formError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company</label><input type="text" value={form.company} onChange={(e) => setForm(f => ({...f, company: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tax ID</label><input type="text" value={form.tax_id} onChange={(e) => setForm(f => ({...f, tax_id: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label><textarea value={form.address} onChange={(e) => setForm(f => ({...f, address: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" rows="2" /></div>
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label><input type="text" value={form.notes} onChange={(e) => setForm(f => ({...f, notes: e.target.value}))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
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

export default Suppliers;
