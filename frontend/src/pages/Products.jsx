import { useState } from 'react';
import { Trash2, Search, Package } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

const Products = () => {
    const { products, loading, error, deleteProduct, searchProducts, pagination, goToPage } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        searchProducts(searchTerm);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                <p className="text-sm text-slate-500">Manage your product inventory</p>
            </div>

            <form onSubmit={handleSearch} className="flex">
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

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-12 text-center">
                                    <Package size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-400">No products found</p>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="h-10 w-10 object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 flex items-center justify-center text-slate-300">
                                                        <Package size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-slate-800">{product.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Rp {Number(product.selling_price).toLocaleString('id-ID')}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                            product.stock > 10
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : product.stock > 0
                                                    ? 'bg-amber-50 text-amber-700'
                                                    : 'bg-red-50 text-red-700'
                                        }`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination.last_page > 1 && (
                <div className="flex justify-center gap-1.5">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                                pagination.current_page === page
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
