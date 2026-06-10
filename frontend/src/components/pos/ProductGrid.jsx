import { useState } from "react";
import { Search, Plus, Package, Grid3X3, List, X, Tag, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

const ProductGrid = ({ onAddToCart }) => {
    const { t, locale } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [animatingId, setAnimatingId] = useState(null);
    const [imageLoaded, setImageLoaded] = useState({});
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

    const ProductSkeleton = () => (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-slate-100" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                <div className="flex justify-between">
                    <div className="h-5 bg-slate-100 rounded-lg w-1/3" />
                    <div className="h-4 bg-slate-100 rounded-lg w-1/4" />
                </div>
                <div className="h-10 bg-slate-100 rounded-xl w-full" />
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white/40 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-lg p-5">
            {/* Search & Filter Bar */}
            <div className="shrink-0 space-y-4 mb-4">
                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative group">
                            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                            <input
                                type="text"
                                placeholder={t('pos.searchProducts')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all duration-300 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchTerm(''); searchProducts(''); }}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors bg-slate-50 hover:bg-slate-100 rounded-lg p-1"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </form>
                    <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all duration-200 ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            title="Grid view"
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-xl transition-all duration-200 ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            title="List view"
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Categories - Premium Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin-cat">
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                            activeCategory === null
                                ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-lg shadow-primary-200/40 scale-[1.02]'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 shadow-sm'
                        }`}
                    >
                        <Tag size={13} />
                        {t('pos.allCategories')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                                activeCategory === cat.id
                                    ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-lg shadow-primary-200/40 scale-[1.02]'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 shadow-sm'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Area */}
            {loading ? (
                <div className="flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`flex-1 overflow-y-auto pr-1 scrollbar-thin-prod ${viewMode === 'grid' ? '' : ''}`}>
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                            <div className="relative">
                                <div className="w-28 h-28 bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <Package size={52} className="text-slate-200" />
                                </div>
                                <span className="absolute -top-2 -right-2 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle size={16} className="text-amber-500" />
                                </span>
                            </div>
                            <p className="text-lg font-bold text-slate-400 mt-6">{t('pos.noProducts')}</p>
                            <p className="text-sm text-slate-300 mt-1.5 text-center px-8 leading-relaxed">{t('pos.noProductsDesc')}</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-max">
                            {products.map((product) => {
                                const isOutOfStock = product.stock <= 0;
                                const isAnimating = animatingId === product.id;

                                return (
                                    <div
                                        key={product.id}
                                        onClick={(e) => !isOutOfStock && handleAddToCart(e, product)}
                                        className={`group relative bg-white rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col ${
                                            isOutOfStock ? 'opacity-50 grayscale' : 'hover:-translate-y-1 hover:border-slate-200'
                                        } ${
                                            isAnimating ? 'ring-2 ring-primary-400 ring-offset-2 scale-[0.97]' : ''
                                        }`}
                                    >
                                        {/* Image */}
                                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative">
                                            {product.image ? (
                                                <>
                                                    {!imageLoaded[product.id] && (
                                                        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
                                                    )}
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out ${
                                                            imageLoaded[product.id] ? 'opacity-100' : 'opacity-0'
                                                        }`}
                                                        onLoad={() => setImageLoaded(prev => ({ ...prev, [product.id]: true }))}
                                                    />
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={40} className="text-slate-200" />
                                                </div>
                                            )}

                                            {/* Overlay gradient */}
                                            {!isOutOfStock && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            )}

                                            {/* Stock badge */}
                                            <div className="absolute top-2.5 left-2.5">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
                                                    isOutOfStock
                                                        ? 'bg-red-50/90 text-red-600 border border-red-200/50'
                                                        : product.stock < 10
                                                        ? 'bg-amber-50/90 text-amber-700 border border-amber-200/50'
                                                        : 'bg-emerald-50/90 text-emerald-700 border border-emerald-200/50'
                                                }`}>
                                                    {isOutOfStock ? (
                                                        <X size={10} />
                                                    ) : (
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                                                product.stock < 10 ? 'bg-amber-400' : 'bg-emerald-400'
                                                            }`} />
                                                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                                                product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                                                            }`} />
                                                        </span>
                                                    )}
                                                    {isOutOfStock ? 'Habis' : product.stock}
                                                </span>
                                            </div>

                                            {/* Category badge */}
                                            <div className="absolute top-2.5 right-2.5">
                                                <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[7px] font-bold text-slate-500 shadow-sm border border-white/50">
                                                    {product.category?.name || (locale === 'id' ? 'Tanpa Kategori' : 'Uncategorized')}
                                                </span>
                                            </div>


                                        </div>

                                        {/* Info */}
                                        <div className="p-3.5 flex flex-col flex-1">
                                            <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors duration-200">
                                                {product.name}
                                            </h3>
                                            <div className="mt-auto pt-2.5 flex items-end justify-between gap-2">
                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{t('pos.price')}</p>
                                                    <p className="text-sm font-black text-slate-900 tabular-nums">
                                                        Rp {Number(product.selling_price).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{t('pos.stock')}</p>
                                                    <p className={`text-[11px] font-bold tabular-nums ${
                                                        isOutOfStock ? 'text-red-500' : product.stock < 10 ? 'text-amber-600' : 'text-slate-600'
                                                    }`}>
                                                        {product.stock} {product.unit || 'pcs'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Add button */}
                                            {!isOutOfStock && (
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-primary-600 transition-all shadow-sm active:scale-[0.97] hover:shadow-lg hover:shadow-primary-200/30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200"
                                                >
                                                    <Plus size={14} />
                                                    {t('pos.addItem')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* List View */
                        <div className="space-y-2">
                            {products.map((product) => {
                                const isOutOfStock = product.stock <= 0;

                                return (
                                    <div
                                        key={product.id}
                                        onClick={(e) => !isOutOfStock && handleAddToCart(e, product)}
                                        className={`group flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${
                                            isOutOfStock ? 'opacity-50 grayscale' : ''
                                        }`}
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden shrink-0 relative">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={24} className="text-slate-200" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{product.category?.name || (locale === 'id' ? 'Tanpa Kategori' : 'Uncategorized')}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-black text-slate-900 tabular-nums">Rp {Number(product.selling_price).toLocaleString('id-ID')}</p>
                                            <p className={`text-[10px] font-bold mt-0.5 ${
                                                isOutOfStock ? 'text-red-500' : product.stock < 10 ? 'text-amber-600' : 'text-slate-400'
                                            }`}>
                                                {product.stock} {product.unit || 'pcs'}
                                            </p>
                                        </div>
                                        {!isOutOfStock && (
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="px-4 py-2.5 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-primary-600 transition-all shadow-sm active:scale-[0.97] flex items-center gap-1.5 hover:shadow-lg hover:shadow-primary-200/30 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                            >
                                                <Plus size={14} />
                                                {t('pos.addItem')}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Scrollbar & Animation Styles */}
            <style>{`
                .scrollbar-thin-cat::-webkit-scrollbar { height: 3px; }
                .scrollbar-thin-cat::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin-cat::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .scrollbar-thin-cat::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .scrollbar-thin-cat { scrollbar-width: thin; }

                .scrollbar-thin-prod::-webkit-scrollbar { width: 3px; }
                .scrollbar-thin-prod::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin-prod::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .scrollbar-thin-prod::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .scrollbar-thin-prod { scrollbar-width: thin; }
            `}</style>
        </div>
    );
};

export default ProductGrid;
