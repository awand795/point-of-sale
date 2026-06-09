import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Tag, Calendar, Percent, DollarSign } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useDiscounts } from '../hooks/useDiscounts';

const Discounts = () => {
    const { t } = useLanguage();
    const { discounts, loading, error, createDiscount, updateDiscount, deleteDiscount, searchDiscounts, pagination, goToPage } = useDiscounts();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', code: '', type: 'percentage', value: '', min_purchase: '', max_uses: '', start_date: '', end_date: '', description: '' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = (e) => { e.preventDefault(); searchDiscounts(searchTerm); };
    const openCreate = () => { setEditing(null); setForm({ name: '', code: '', type: 'percentage', value: '', min_purchase: '', max_uses: '', start_date: '', end_date: '', description: '' }); setFormError(null); setShowModal(true); };
    const openEdit = (d) => { setEditing(d); setForm({ name: d.name || '', code: d.code || '', type: d.type || 'percentage', value: d.value || '', min_purchase: d.min_purchase || '', max_uses: d.max_uses || '', start_date: d.start_date || '', end_date: d.end_date || '', description: d.description || '' }); setFormError(null); setShowModal(true); };
    const handleSubmit = async (e) => {
        e.preventDefault(); setSubmitting(true); setFormError(null);
        try { if (editing) { await updateDiscount(editing.id, form); } else { await createDiscount(form); } setShowModal(false); }
        catch (err) { setFormError(err.response?.data?.message || 'Failed to save discount'); } finally { setSubmitting(false); }
    };
    const handleDelete = async (id) => { if (window.confirm('Delete this discount?')) { try { await deleteDiscount(id); } catch { alert('Failed to delete discount'); } } };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div></div>;

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-slate-800">{t('sidebar.discounts')}</h1><p className="text-sm text-slate-500">Manage discounts and promotional campaigns</p></div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition shadow-sm"><Plus size={18} /> Add Discount</button>
            </div>
            <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search discounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" /></div>
                <button type="submit" className="ml-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"><Search size={18} /></button>
            </form>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discounts.length === 0 ? (
                    <div className="col-span-full text-center py-12"><Tag size={32} className="mx-auto text-slate-300 mb-2" /><p className="text-sm text-slate-400">No discounts found</p></div>
                ) : discounts.map((d) => (
                    <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    {d.type === 'percentage' ? <Percent size={18} /> : <DollarSign size={18} />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                                    {d.code && <p className="text-xs font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded mt-0.5 inline-block">{d.code}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                            <p className="text-2xl font-black text-slate-900">{d.type === 'percentage' ? `${d.value}%` : `Rp ${Number(d.value).toLocaleString('id-ID')}`}</p>
                            {d.min_purchase > 0 && <p className="text-xs text-slate-400">Min. purchase: Rp {Number(d.min_purchase).toLocaleString('id-ID')}</p>}
                            {d.max_uses > 0 && <p className="text-xs text-slate-400">Max uses: {d.max_uses}</p>}
                            {d.start_date && <p className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={10} />{d.start_date} — {d.end_date || '∞'}</p>}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${d.is_active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{d.is_active !== false ? 'Active' : 'Inactive'}</span>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"><Edit size={14} /></button>
                                <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {pagination.last_page > 1 && (<div className="flex justify-center gap-1.5">{Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${pagination.current_page === page ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>))}</div>)}
            {showModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
                <div className="flex justify-between items-center mb-5"><h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Discount' : 'Add Discount'}</h2><button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"><X size={18} /></button></div>
                {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{formError}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label><input type="text" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Code</label><input type="text" value={form.code} onChange={(e) => setForm(f => ({...f, code: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Type *</label><select value={form.type} onChange={(e) => setForm(f => ({...f, type: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"><option value="percentage">Percentage (%)</option><option value="fixed">Fixed (Rp)</option></select></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Value *</label><input type="number" min="0" step={form.type === 'percentage' ? '1' : '100'} value={form.value} onChange={(e) => setForm(f => ({...f, value: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Min. Purchase</label><input type="number" min="0" value={form.min_purchase} onChange={(e) => setForm(f => ({...f, min_purchase: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Max Uses</label><input type="number" min="0" value={form.max_uses} onChange={(e) => setForm(f => ({...f, max_uses: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label><input type="date" value={form.start_date} onChange={(e) => setForm(f => ({...f, start_date: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label><input type="date" value={form.end_date} onChange={(e) => setForm(f => ({...f, end_date: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm(f => ({...f, description: e.target.value}))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" rows="2" /></div>
                    <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-sm">{submitting ? 'Saving...' : 'Save'}</button></div>
                </form>
            </div></div>)}
        </div>
    );
};

export default Discounts;
