import { useState } from 'react';
import { Trash2, Search, Package, Edit } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import EmptyState, { LoadingSpinner } from "../components/shared/EmptyState";
import PageHeader from "../components/shared/PageHeader";
import DataTable from "../components/shared/DataTable";
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useProducts } from '../hooks/useProducts';

const Products = () => {
    const { t, locale } = useLanguage();
    const { products, loading, error, deleteProduct, searchProducts, pagination, goToPage } = useProducts();
    const { isDemo } = useAuth();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const term = e.target?.value ?? e;
        setSearchTerm(term);
        searchProducts(term);
    };

    const handleDelete = async (id) => {
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm(t('categories.deleteConfirm').replace('category', 'product'))) {
            try {
                await deleteProduct(id);
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    const columns = [
        {
            key: 'name',
            label: t('products.product'),
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] overflow-hidden flex items-center justify-center shrink-0">
                        {row.image ? (
                            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package size={16} className="text-slate-400 dark:text-slate-500" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 truncate">{row.name}</p>
                        {row.sku && <p className="text-[12px] text-slate-400 dark:text-slate-500">{row.sku}</p>}
                    </div>
                </div>
            ),
        },
        {
            key: 'selling_price',
            label: t('products.price'),
            sortable: true,
            align: 'right',
            render: (row) => (
                <span className="text-[14px] font-semibold text-primary-600 dark:text-primary-400 tabular-nums">
                    Rp {Number(row.selling_price).toLocaleString('id-ID')}
                </span>
            ),
        },
        {
            key: 'category',
            label: 'Kategori',
            sortable: false,
            align: 'left',
            render: (row) => (
                <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                    {row.category?.name || '-'}
                </span>
            ),
        },
        {
            key: 'stock',
            label: t('products.stock'),
            sortable: true,
            align: 'center',
            render: (row) => {
                const stock = Number(row.stock);
                let style = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
                if (stock <= 0) style = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
                else if (stock < 10) style = 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
                return (
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-semibold ${style}`}>
                        {stock} {t('products.units')}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: t('products.actions'),
            align: 'right',
            width: '80px',
            render: (row) => (
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all" title="Edit">
                        <Edit size={15} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        title="Hapus"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            ),
        },
    ];

    if (loading && products.length === 0) {
        return (
            <div className="space-y-6">
                <PageHeader title={t('products.title')} subtitle={t('products.subtitle')} />
                <LoadingSpinner text={locale === 'id' ? 'Memuat produk...' : 'Loading products...'} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('products.title')}
                subtitle={t('products.subtitle')}
                action={true}
                actionLabel={locale === 'id' ? 'Tambah Produk' : 'Add Product'}
            />

            {/* Search */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('products.search')}
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

            <DataTable
                columns={columns}
                data={products}
                pageSize={pagination?.per_page || 10}
                currentPage={pagination?.current_page}
                totalPages={pagination?.last_page}
                onPageChange={goToPage}
                emptyState={
                    <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] overflow-hidden">
                        <EmptyState
                            icon={Package}
                            title={locale === 'id' ? 'Belum Ada Produk' : 'No Products'}
                            description={locale === 'id' ? 'Belum ada produk yang tersedia.' : 'No products available yet.'}
                        />
                    </div>
                }
                loading={false}
            />
        </div>
    );
};

export default Products;
