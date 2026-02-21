import { useState } from "react";
import { Search, Plus, Package } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";

const ProductGrid = ({ onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { products, loading, searchProducts } = useProducts({ per_page: 12 });

    const handleSearch = (e) => {
        e.preventDefault();
        searchProducts(searchTerm);
    }

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        onAddToCart(product);
    }

    return (
        <div className="h-full flex flex-col">
            <form onSubmit={handleSearch} className="flex mb-4">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
                <button type="submit" className="ml-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
                    <Search size={18} />
                </button>
            </form>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
                    {products.map((product) => (
                        <div key={product.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition group overflow-hidden">
                            <div className="aspect-square bg-slate-100 overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                        <Package size={32} />
                                        <span className="text-xs mt-1">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
                                <p className="text-sm font-bold text-primary-600 mt-0.5">
                                    Rp {Number(product.selling_price).toLocaleString('id-ID')}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5 mb-2">Stock: {product.stock}</p>
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    disabled={product.stock <= 0}
                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    <Plus size={15} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductGrid;
