import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, FolderOpen } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useCategories } from '../hooks/useCategories';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const Categories = () => {
    const { t, locale } = useLanguage();
    const {
        categories,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        searchCategories,
        pagination,
        goToPage,
    } = useCategories();
    const { isDemo } = useAuth();
    const { showToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', is_active: true });
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSearch = (value) => {
        setSearchTerm(value);
        searchCategories(value);
    };

    const handleDelete = async (id) => {
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm(t('categories.deleteConfirm'))) {
            try {
                await deleteCategory(id);
            } catch (err) {
                alert('Failed to delete category');
            }
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', is_active: true });
        setFormError(null);
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name || '',
            description: category.description || '',
            is_active: category.is_active ?? true,
        });
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
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            setShowModal(false);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title={t('categories.title')} subtitle={t('categories.subtitle')} />
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('categories.title')}
                subtitle={t('categories.subtitle')}
                action={true}
                actionLabel={t('categories.addCategory')}
                actionIcon={Plus}
                onAction={openCreateModal}
            />

            {/* Search */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('categories.search')}
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
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">{t('categories.name')}</th>
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">{t('categories.description')}</th>
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">{t('categories.status')}</th>
                            <th className="px-5 py-3.5 text-right text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">{t('categories.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70 dark:divide-white/[0.04]">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-16 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                                        <FolderOpen size={28} className="text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <p className="text-[15px] font-semibold text-slate-500 dark:text-slate-400">{t('categories.noCategories')}</p>
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200">{category.name}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-[14px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs">
                                            {category.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-semibold ${
                                            category.is_active
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                        }`}>
                                            {category.is_active ? t('categories.active') : t('categories.inactive')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
                                                title="Edit"
                                            >
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
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
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all ${
                                    pagination.current_page === page
                                        ? 'bg-primary-500 text-white'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-surface-raised rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">
                                {editingCategory ? t('categories.edit') : t('categories.addNew')}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all">
                                <X size={18} />
                            </button>
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
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('categories.name')}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                                    placeholder="Category name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('categories.description')}</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.10] rounded-xl text-[14px] text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none"
                                    placeholder="Optional description"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 dark:bg-white/[0.10] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:dark:border-slate-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                                    <span className="ml-2.5 text-[14px] font-medium text-slate-700 dark:text-slate-300">{t('categories.active')}</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 text-[14px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.06] rounded-xl hover:bg-slate-200 dark:hover:bg-white/[0.10] transition-all"
                                >
                                    {t('categories.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || isDemo}
                                    className="px-5 py-2.5 text-[14px] font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-all shadow-sm shadow-primary-500/20 active:scale-[0.97]"
                                >
                                    {submitting ? t('categories.saving') : t('categories.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
