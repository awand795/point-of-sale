import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Users, Mail, Phone, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useCustomers } from '../hooks/useCustomers';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const Customers = () => {
    const { t, locale } = useLanguage();
    const {
        customers, loading, error,
        createCustomer, updateCustomer, deleteCustomer,
        searchCustomers, pagination, goToPage,
    } = useCustomers();
    const { isDemo } = useAuth();
    const { showToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', birth_date: '', notes: '' });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = (value) => {
        setSearchTerm(value);
        searchCustomers(value);
    };

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
        if (isDemo) {
            showToast('warning');
            return;
        }
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
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm(t('customers.deleteConfirm') || 'Are you sure you want to delete this customer?')) {
            try { await deleteCustomer(id); } catch { alert('Failed to delete customer'); }
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title={t('sidebar.customers')} subtitle={locale === 'id' ? 'Kelola database pelanggan Anda' : 'Manage your customer database'} />
                <LoadingSpinner text={locale === 'id' ? 'Memuat pelanggan...' : 'Loading customers...'} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('sidebar.customers')}
                subtitle={locale === 'id' ? 'Kelola database pelanggan Anda' : 'Manage your customer database'}
                action={true}
                actionLabel={locale === 'id' ? 'Tambah Pelanggan' : 'Add Customer'}
                actionIcon={Plus}
                onAction={openCreate}
            />

            {/* Search — debounced */}
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder={locale === 'id' ? 'Cari pelanggan...' : 'Search customers...'}
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">{t('categories.name')}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">{locale === 'id' ? 'Alamat' : 'Address'}</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">{t('categories.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                        {customers.length === 0 ? (
                            <tr><td colSpan="4" className="px-4 py-12 text-center">
                                <Users size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-sm text-slate-400 dark:text-slate-500">{locale === 'id' ? 'Tidak ada pelanggan ditemukan' : 'No customers found'}</p>
                            </td></tr>
                        ) : customers.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-semibold">{c.name?.charAt(0)}</div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                                            {c.birth_date && <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5"><Calendar size={10} className="inline mr-1" />{c.birth_date}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="space-y-0.5">
                                        {c.email && <p className="text-xs text-slate-500 dark:text-slate-400"><Mail size={12} className="inline mr-1" />{c.email}</p>}
                                        {c.phone && <p className="text-xs text-slate-500 dark:text-slate-400"><Phone size={12} className="inline mr-1" />{c.phone}</p>}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px]">{c.address || '-'}</p>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"><Edit size={14} /></button>
                                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ml-1"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination?.last_page > 1 && (
                <div className="flex justify-center gap-1">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => goToPage(page)} className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all ${pagination.current_page === page ? 'bg-primary-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'}`}>{page}</button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{editing ? (locale === 'id' ? 'Edit Pelanggan' : 'Edit Customer') : (locale === 'id' ? 'Tambah Pelanggan' : 'Add Customer')}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"><X size={18} /></button>
                        </div>
                        {formError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{locale === 'id' ? 'Nama *' : 'Name *'}</label>
                                <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{locale === 'id' ? 'Telepon' : 'Phone'}</label>
                                    <input type="text" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{locale === 'id' ? 'Alamat' : 'Address'}</label>
                                <textarea value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" rows="2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{locale === 'id' ? 'Tanggal Lahir' : 'Birth Date'}</label>
                                    <input type="date" value={form.birth_date} onChange={(e) => setForm(f => ({ ...f, birth_date: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{locale === 'id' ? 'Catatan' : 'Notes'}</label>
                                    <input type="text" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">{locale === 'id' ? 'Batal' : 'Cancel'}</button>
                                <button type="submit" disabled={submitting || isDemo} className="px-4 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-all shadow-sm">{submitting ? (locale === 'id' ? 'Menyimpan...' : 'Saving...') : (locale === 'id' ? 'Simpan' : 'Save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
