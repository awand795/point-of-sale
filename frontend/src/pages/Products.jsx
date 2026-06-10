import { useState } from 'react';
import { Trash2, Search, Package, X, Plus, Edit } from 'lucide-react';
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
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.06] overflow-hidden flex items-center justify-center shrink-0">
                        {row.image ? (
                            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                        ) : (
                            <Package size={14} className="text-slate-400 dark:text-slate-500" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{row.name}</p>
                        {row.sku && <p className="text-[10px] text-slate-400 dark:text-slate-500">{row.sku}</p>}
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
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    Rp {Number(row.selling_price).toLocaleString('id-ID')}
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
                let color = 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
                if (stock <= 0) color = 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
                else if (stock < 10) color = 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
                return (
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium ${color}`}>
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
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all">
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                        <Trash2 size={14} />
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
            <div className="relative max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder={t('products.search')}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-9 pr-4 h-9 bg-surface dark:bg-surface-raised border border-slate-200 dark:border-white/[0.12] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors placeholder:text-slate-400 dark:placeholder-slate-500"
                />
            </div>

            {error && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">
                    {error}
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
                    <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
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
