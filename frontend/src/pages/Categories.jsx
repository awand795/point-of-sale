import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, FolderOpen } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useCategories } from '../hooks/useCategories';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const Categories = () => {
    const { t } = useLanguage();
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

            {/* Search — debounced */}
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder={t('categories.search')}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-9 pr-4 h-9 bg-surface dark:bg-surface-raised border border-slate-200 dark:border-white/[0.12] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors placeholder:text-slate-400 dark:placeholder-slate-500"
                />
            </div>

            {error && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">{error}</div>
            )}

            <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">{t('categories.name')}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">{t('categories.description')}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">{t('categories.status')}</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">{t('categories.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-4 py-12 text-center">
                                    <FolderOpen size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                    <p className="text-sm text-slate-400 dark:text-slate-500">{t('categories.noCategories')}</p>
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{category.name}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs">
                                            {category.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-md ${
                                            category.is_active
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                        }`}>
                                            {category.is_active ? t('categories.active') : t('categories.inactive')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ml-1"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                {editingCategory ? t('categories.edit') : t('categories.addNew')}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">{formError}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('categories.name')}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Category name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('categories.description')}</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
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
                                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:dark:border-slate-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                                    <span className="ml-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">{t('categories.active')}</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    {t('categories.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || isDemo}
                                    className="px-4 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-all shadow-sm"
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
