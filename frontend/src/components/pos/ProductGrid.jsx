import { useState } from "react";
import { Search, Plus, Package } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

const ProductGrid = ({ onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const { products, loading, searchProducts, filterByCategory } = useProducts({ per_page: 12 });
    const { categories } = useCategories({ per_page: 100 });

    const handleSearch = (e) => {
        e.preventDefault();
        searchProducts(searchTerm);
    }

    const handleCategoryClick = (categoryId) => {
        const nextCategory = activeCategory === categoryId ? null : categoryId;
        setActiveCategory(nextCategory);
        filterByCategory(nextCategory);
    }

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        onAddToCart(product);
    }

    return (
        <div className="h-full flex flex-col">
            <div className="space-y-4 mb-4 shrink-0">
                <form onSubmit={handleSearch} className="flex">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU or barcode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </form>

                {/* Categories - Horizontal Scroll */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            activeCategory === null
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                activeCategory === cat.id
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                        }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
                    {products.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                            <Package size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id}
                                onClick={(e) => product.stock > 0 && handleAddToCart(e, product)}
                                className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden cursor-pointer ${product.stock <= 0 ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                            <Package size={40} />
                                        </div>
                                    )}
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                            <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wider">Out of Stock</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm">
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Price</p>
                                            <p className="text-sm font-black text-slate-900">
                                                Rp {Number(product.selling_price).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 font-medium">Stock</p>
                                            <p className={`text-xs font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-slate-600'}`}>
                                                {product.stock} {product.unit || 'pcs'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={product.stock <= 0}
                                        className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-primary-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm active:scale-95"
                                    >
                                        <Plus size={14} />
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default ProductGrid;
