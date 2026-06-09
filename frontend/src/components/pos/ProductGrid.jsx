import { useState } from "react";
import { Search, Plus, Package, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

const ProductGrid = ({ onAddToCart }) => {
    const { t, locale } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [animatingId, setAnimatingId] = useState(null);
    const { products, loading, searchProducts, filterByCategory } = useProducts({ per_page: 12 });
    const { categories } = useCategories({ per_page: 100 });

    const handleSearch = (e) => {
        e.preventDefault();
        searchProducts(searchTerm);
    };

    const handleCategoryClick = (categoryId) => {
        const nextCategory = activeCategory === categoryId ? null : categoryId;
        setActiveCategory(nextCategory);
        filterByCategory(nextCategory);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        setAnimatingId(product.id);
        setTimeout(() => setAnimatingId(null), 500);
        onAddToCart(product);
    };

    return (
        <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-lg p-5">
            {/* Search & Filter Bar */}
            <div className="shrink-0 space-y-4 mb-4">
                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('pos.searchProducts')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all placeholder:text-slate-400 shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchTerm(''); searchProducts(''); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </form>
                    <div className="hidden sm:flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Categories - Premium Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                            activeCategory === null
                                ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-lg shadow-primary-200/40 scale-105'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300 hover:text-primary-600 shadow-sm'
                        }`}
                    >
                        {t('pos.allCategories')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                                activeCategory === cat.id
                                    ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-lg shadow-primary-200/40 scale-105'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300 hover:text-primary-600 shadow-sm'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">Loading products...</p>
                    </div>
                </div>
            ) : (
                <div className={`flex-1 overflow-y-auto pr-1 space-y-3 ${
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max'
                        : 'flex flex-col'
                }`}>
                    {products.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-300">
                            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                                <Package size={48} className="text-slate-200" />
                            </div>
                            <p className="text-lg font-bold text-slate-400">{t('pos.noProducts')}</p>
                            <p className="text-sm text-slate-300 mt-1">{t('pos.noProductsDesc')}</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                onClick={(e) => product.stock > 0 && handleAddToCart(e, product)}
                                className={`group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer ${
                                    product.stock <= 0 ? 'opacity-60 grayscale-[0.6]' : ''
                                } ${
                                    animatingId === product.id ? 'scale-[0.97] ring-2 ring-primary-400 ring-offset-2' : ''
                                }`}
                            >
                                {/* Product Image */}
                                <div className={`${viewMode === 'grid' ? 'aspect-[4/3]' : 'w-24 h-24 shrink-0'} bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative`}>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={viewMode === 'grid' ? 36 : 28} className="text-slate-200" />
                                        </div>
                                    )}
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
                                            <span className="bg-white/95 px-3 py-1.5 rounded-xl text-[9px] font-bold text-slate-800 uppercase tracking-wider shadow-lg">
                                                {t('pos.outOfStock')}
                                            </span>
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-bold text-slate-500 shadow-sm border border-white/50">
                                            {product.category?.name || (locale === 'id' ? 'Tanpa Kategori' : 'Uncategorized')}
                                        </span>
                                    </div>
                                    {/* Quick add overlay */}
                                    {product.stock > 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                                                <Plus size={14} /> {t('pos.addItem')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                {viewMode === 'grid' ? (
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-medium">{t('pos.price')}</p>
                                                <p className="text-base font-black text-slate-900">Rp {Number(product.selling_price).toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-400 font-medium">{t('pos.stock')}</p>
                                                <p className={`text-xs font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-slate-600'}`}>
                                                    {product.stock} {product.unit || 'pcs'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            disabled={product.stock <= 0}
                                            className="w-full mt-3 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-primary-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-sm active:scale-[0.97] hover:shadow-lg hover:shadow-primary-200/30"
                                        >
                                            <Plus size={15} />
                                            {t('pos.addItem')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 p-3">
                                        <div className="flex-1 min-w-0 py-2">
                                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                            <p className="text-xs text-slate-400 mt-0.5">{product.category?.name || 'Uncategorized'}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <p className="text-base font-black text-slate-900">Rp {Number(product.selling_price).toLocaleString('id-ID')}</p>
                                                <p className={`text-xs font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-slate-400'}`}>
                                                    {product.stock} {product.unit || 'pcs'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center shrink-0">
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={product.stock <= 0}
                                                className="px-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-primary-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-sm active:scale-[0.97] flex items-center gap-2"
                                            >
                                                <Plus size={16} />
                                                {t('pos.addItem')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
