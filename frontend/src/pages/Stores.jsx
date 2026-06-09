import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Store, MapPin, Phone, Mail, Building } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useStores } from '../hooks/useStores';
import EmptyState, { LoadingSpinner } from "../components/shared/EmptyState";

const Stores = () => {
    const { t } = useLanguage();
    const { stores, loading, error, createStore, updateStore, deleteStore, pagination, goToPage } = useStores();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', code: '', address: '', phone: '', email: '' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const openCreate = () => { setEditing(null); setForm({ name: '', code: '', address: '', phone: '', email: '' }); setFormError(null); setShowModal(true); };
    const openEdit = (s) => { setEditing(s); setForm({ name: s.name || '', code: s.code || '', address: s.address || '', phone: s.phone || '', email: s.email || '' }); setFormError(null); setShowModal(true); };
    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setFormError(null);
        try { if (editing) { await updateStore(editing.id, form); } else { await createStore(form); } setShowModal(false); }
        catch (err) { setFormError(err.response?.data?.message || 'Failed to save store'); } finally { setSubmitting(false); }
    };
    const handleDelete = async (id) => { if (window.confirm('Delete this store?')) { try { await deleteStore(id); } catch { alert('Failed to delete store'); } } };

    if (loading) return <LoadingSpinner text="Memuat toko..." />;

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('sidebar.stores')}</h1><p className="text-sm text-slate-500 font-medium">Manage multiple store/outlet locations</p></div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition shadow-sm"><Plus size={18} /> Add Store</button>
            </div>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.length === 0 ? (
                    <div className="col-span-full text-center py-12"><Building size={32} className="mx-auto text-slate-300 mb-2" /><p className="text-sm text-slate-400">No stores found</p></div>
                ) : stores.map((s) => (
                    <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Store size={18} /></div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                                    {s.code && <p className="text-xs text-slate-400 font-mono">{s.code}</p>}
                                </div>
                            </div>
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${s.is_active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{s.is_active !== false ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="space-y-1.5 mb-3">
                            {s.address && <p className="text-xs text-slate-500 flex items-start gap-1.5"><MapPin size={12} className="mt-0.5 shrink-0" />{s.address}</p>}
                            {s.phone && <p className="text-xs text-slate-500 flex items-center gap-1.5"><Phone size={12} />{s.phone}</p>}
                            {s.email && <p className="text-xs text-slate-500 flex items-center gap-1.5"><Mail size={12} />{s.email}</p>}
                        </div>
                        <div className="flex justify-end gap-1 pt-3 border-t border-slate-100">
                            <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {pagination.last_page > 1 && (<div className="flex justify-center gap-1.5">{Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${pagination.current_page === page ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>))}</div>)}
            {showModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
                <div className="flex justify-between items-center mb-5"><h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Store' : 'Add Store'}</h2><button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"><X size={18} /></button></div>
                {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{formError}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Code *</label><input type="text" value={form.code} onChange={(e) => setForm(f => ({...f, code: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label><textarea value={form.address} onChange={(e) => setForm(f => ({...f, address: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" rows="2" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-sm">{submitting ? 'Saving...' : 'Save'}</button></div>
                </form>
            </div></div>)}
        </div>
    );
};

export default Stores;
