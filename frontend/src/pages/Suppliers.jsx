import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Building, Mail, Phone, Briefcase } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useSuppliers } from '../hooks/useSuppliers';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const Suppliers = () => {
    const { t, locale } = useLanguage();
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

            {/* Search */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search suppliers..."
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
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Contact</th>
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Tax ID</th>
                            <th className="px-5 py-3.5 text-right text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70 dark:divide-white/[0.04]">
                        {suppliers.length === 0 ? (<tr><td colSpan="4" className="px-5 py-16 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                                <Building size={28} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-[15px] font-semibold text-slate-500 dark:text-slate-400">No suppliers found</p>
                        </td></tr>) : suppliers.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-700 dark:text-primary-300 text-[15px] font-bold shrink-0">{s.name?.charAt(0)?.toUpperCase()}</div>
                                        <div><p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{s.name}</p>{s.company && <p className="text-[12px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5"><Briefcase size={12} />{s.company}</p>}</div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="space-y-1">{s.email && <p className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Mail size={13} />{s.email}</p>}{s.phone && <p className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Phone size={13} />{s.phone}</p>}</div>
                                </td>
                                <td className="px-5 py-3.5"><p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium">{s.tax_id || '-'}</p></td>
                                <td className="px-5 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all" title="Edit"><Edit size={15} /></button>
                                        <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" title="Hapus"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination?.last_page > 1 && (
                <div className="flex items-center justify-between px-1">
                    <p className="text-[13px] text-slate-400 dark:text-slate-500">
                        {locale === 'id' ? 'Menampilkan' : 'Showing'} {((pagination.current_page - 1) * pagination.per_page) + 1}–{Math.min(pagination.current_page * pagination.per_page, pagination.total)} {locale === 'id' ? 'dari' : 'of'} {pagination.total}
                    </p>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all ${pagination.current_page === page ? 'bg-primary-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'}`}>{page}</button>
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-surface-raised rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">{editing ? 'Edit Supplier' : 'Add Supplier'}</h2>
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
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company</label><input type="text" value={form.company} onChange={(e) => setForm(f => ({...f, company: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tax ID</label><input type="text" value={form.tax_id} onChange={(e) => setForm(f => ({...f, tax_id: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
                            </div>
                            <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label><textarea value={form.address} onChange={(e) => setForm(f => ({...f, address: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none" rows="2" /></div>
                            <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Notes</label><input type="text" value={form.notes} onChange={(e) => setForm(f => ({...f, notes: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
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

export default Suppliers;
