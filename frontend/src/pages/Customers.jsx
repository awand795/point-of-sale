import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Users, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCustomers }
import EmptyState, { LoadingSpinner } from "../components/shared/EmptyState"; from '../hooks/useCustomers';

const Customers = () => {
    const { t } = useLanguage();
    const {
        customers, loading, error,
        createCustomer, updateCustomer, deleteCustomer,
        searchCustomers, pagination, goToPage,
    } = useCustomers();

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', birth_date: '', notes: '' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = (e) => { e.preventDefault(); searchCustomers(searchTerm); };

    const openCreate = () => {
        setEditing(null);
        setForm({ name: '', email: '', phone: '', address: '', birth_date: '', notes: '' });
        setFormError(null);
        setShowModal(true);
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '', address: c.address || '', birth_date: c.birth_date || '', notes: c.notes || '' });
        setFormError(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        try {
            if (editing) {
                await updateCustomer(editing.id, form);
            } else {
                await createCustomer(form);
            }
            setShowModal(false);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save customer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try { await deleteCustomer(id); } catch { alert('Failed to delete customer'); }
        }
    };

    if (loading) return <LoadingSpinner text="Memuat pelanggan..." />;

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('sidebar.customers')}</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage your customer database</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition shadow-sm">
                    <Plus size={18} /> Add Customer
                </button>
            </div>

            <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <button type="submit" className="ml-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"><Search size={18} /></button>
            </form>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {customers.length === 0 ? (
                            <tr><td colSpan="4" className="px-5 py-12 text-center">
                                <Users size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-400">No customers found</p>
                            </td></tr>
                        ) : customers.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-bold">{c.name?.charAt(0)}</div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{c.name}</p>
                                            {c.birth_date && <p className="text-[10px] text-slate-400 font-medium mt-0.5"><Calendar size={10} className="inline mr-1" />{c.birth_date}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="space-y-0.5">
                                        {c.email && <p className="text-xs text-slate-500"><Mail size={12} className="inline mr-1" />{c.email}</p>}
                                        {c.phone && <p className="text-xs text-slate-500"><Phone size={12} className="inline mr-1" />{c.phone}</p>}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <p className="text-sm text-slate-500 font-medium truncate max-w-[200px]">{c.address || '-'}</p>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition ml-1"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.last_page > 1 && (
                <div className="flex justify-center gap-1.5">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${pagination.current_page === page ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Customer' : 'Add Customer'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"><X size={18} /></button>
                        </div>
                        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name *</label>
                                <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                                    <input type="text" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                                <textarea value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" rows="2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Birth Date</label>
                                    <input type="date" value={form.birth_date} onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
                                    <input type="text" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition shadow-sm">{submitting ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
