import { useState } from 'react';
import { Plus, Edit, Trash2, X, Store, MapPin, Phone, Mail, Building } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useStores } from '../hooks/useStores';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const Stores = () => {
    const { t, locale } = useLanguage();
    const { stores, loading, error, createStore, updateStore, deleteStore, pagination, goToPage } = useStores();
    const { isDemo } = useAuth();
    const { showToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', code: '', address: '', phone: '', email: '' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const openCreate = () => { setEditing(null); setForm({ name: '', code: '', address: '', phone: '', email: '' }); setFormError(null); setShowModal(true); };
    const openEdit = (s) => { setEditing(s); setForm({ name: s.name || '', code: s.code || '', address: s.address || '', phone: s.phone || '', email: s.email || '' }); setFormError(null); setShowModal(true); };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDemo) {
            showToast('warning');
            return;
        }
        setSubmitting(true); setFormError(null);
        try { if (editing) { await updateStore(editing.id, form); } else { await createStore(form); } setShowModal(false); }
        catch (err) { setFormError(err.response?.data?.message || 'Failed to save store'); } finally { setSubmitting(false); }
    };
    const handleDelete = async (id) => {
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm('Delete this store?')) { try { await deleteStore(id); } catch { alert('Failed to delete store'); } }
    };

    if (loading) return <LoadingSpinner text="Memuat toko..." />;

    return (
        <div className="space-y-6">
            <PageHeader title={t('sidebar.stores')} subtitle="Manage multiple store/outlet locations" action actionLabel="Tambah Toko" actionIcon={Plus} onAction={openCreate} />

            {error && (
                <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <p className="text-[14px] font-medium text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mb-4">
                            <Building size={28} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-[15px] font-semibold text-slate-500 dark:text-slate-400">No stores found</p>
                    </div>
                ) : stores.map((s) => (
                    <div key={s.id} className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0"><Store size={18} /></div>
                                <div>
                                    <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{s.name}</p>
                                    {s.code && <p className="text-[12px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{s.code}</p>}
                                </div>
                            </div>
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-semibold ${s.is_active !== false ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{s.is_active !== false ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="space-y-1.5 mb-4">
                            {s.address && <p className="text-[13px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5"><MapPin size={13} className="mt-0.5 shrink-0" />{s.address}</p>}
                            {s.phone && <p className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Phone size={13} />{s.phone}</p>}
                            {s.email && <p className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Mail size={13} />{s.email}</p>}
                        </div>
                        <div className="flex justify-end gap-1 pt-3 border-t border-slate-100 dark:border-white/[0.06] opacity-0 group-hover:opacity-100 transition-all duration-150">
                            <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all" title="Edit"><Edit size={15} /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" title="Hapus"><Trash2 size={15} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {pagination?.last_page > 1 && (
                <div className="flex items-center justify-between">
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
                            <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">{editing ? 'Edit Store' : 'Add Store'}</h2>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" required /></div>
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Code *</label><input type="text" value={form.code} onChange={(e) => setForm(f => ({...f, code: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" required /></div>
                            </div>
                            <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label><textarea value={form.address} onChange={(e) => setForm(f => ({...f, address: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none" rows="2" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
                                <div><label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" /></div>
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

export default Stores;
