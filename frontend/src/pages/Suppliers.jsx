import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Building, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSuppliers } from '../hooks/useSuppliers';

const Suppliers = () => {
    const { t } = useLanguage();
    const { suppliers, loading, error, createSupplier, updateSupplier, deleteSupplier, searchSuppliers, pagination, goToPage } = useSuppliers();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', address: '', tax_id: '', notes: '' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = (e) => { e.preventDefault(); searchSuppliers(searchTerm); };
    const openCreate = () => { setEditing(null); setForm({ name: '', company: '', email: '', phone: '', address: '', tax_id: '', notes: '' }); setFormError(null); setShowModal(true); };
    const openEdit = (s) => { setEditing(s); setForm({ name: s.name || '', company: s.company || '', email: s.email || '', phone: s.phone || '', address: s.address || '', tax_id: s.tax_id || '', notes: s.notes || '' }); setFormError(null); setShowModal(true); };
    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setFormError(null);
        try { if (editing) { await updateSupplier(editing.id, form); } else { await createSupplier(form); } setShowModal(false); }
        catch (err) { setFormError(err.response?.data?.message || 'Failed to save supplier'); } finally { setSubmitting(false); }
    };
    const handleDelete = async (id) => { if (window.confirm('Delete this supplier?')) { try { await deleteSupplier(id); } catch { alert('Failed to delete supplier'); } } };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div></div>;

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-slate-800">{t('sidebar.suppliers')}</h1><p className="text-sm text-slate-500">Manage your suppliers and vendors</p></div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition shadow-sm"><Plus size={18} /> Add Supplier</button>
            </div>
            <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search suppliers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                <button type="submit" className="ml-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"><Search size={18} /></button>
            </form>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full">
                    <thead><tr className="border-b border-slate-200 bg-slate-50/50"><th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th><th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th><th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax ID</th><th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {suppliers.length === 0 ? (<tr><td colSpan="4" className="px-5 py-12 text-center"><Building size={32} className="mx-auto text-slate-300 mb-2" /><p className="text-sm text-slate-400">No suppliers found</p></td></tr>) : suppliers.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 text-sm font-bold">{s.name?.charAt(0)}</div>
                                        <div><p className="text-sm font-medium text-slate-800">{s.name}</p>{s.company && <p className="text-xs text-slate-400"><Briefcase size={10} className="inline mr-1" />{s.company}</p>}</div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="space-y-0.5">{s.email && <p className="text-xs text-slate-500"><Mail size={12} className="inline mr-1" />{s.email}</p>}{s.phone && <p className="text-xs text-slate-500"><Phone size={12} className="inline mr-1" />{s.phone}</p>}</div>
                                </td>
                                <td className="px-5 py-3.5"><p className="text-sm text-slate-500">{s.tax_id || '-'}</p></td>
                                <td className="px-5 py-3.5 text-right">
                                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition ml-1"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pagination.last_page > 1 && (<div className="flex justify-center gap-1.5">{Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${pagination.current_page === page ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>))}</div>)}
            {showModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
                <div className="flex justify-between items-center mb-5"><h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Supplier' : 'Add Supplier'}</h2><button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"><X size={18} /></button></div>
                {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{formError}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label><input type="text" value={form.company} onChange={(e) => setForm(f => ({...f, company: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Tax ID</label><input type="text" value={form.tax_id} onChange={(e) => setForm(f => ({...f, tax_id: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label><input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label><input type="text" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label><textarea value={form.address} onChange={(e) => setForm(f => ({...f, address: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" rows="2" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label><input type="text" value={form.notes} onChange={(e) => setForm(f => ({...f, notes: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                    <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-sm">{submitting ? 'Saving...' : 'Save'}</button></div>
                </form>
            </div></div>)}
        </div>
    );
};

export default Suppliers;
