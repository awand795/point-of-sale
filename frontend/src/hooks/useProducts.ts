import {useState, useEffect, useCallback} from 'react';
import { productApi } from '../api/product';

export const useProducts = (initialParams={}) => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchProducts = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await productApi.getAll(mergedParams);
            const paginated = response.data.data;
            setProducts(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        }catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const createProduct = async (productData) => {
        try {
            const response = await productApi.create(productData);
            setProducts(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const response = await productApi.update(id, productData);
            setProducts(prev => prev.map(p => p.id === id ? response.data : p));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productApi.delete(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete product');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = (searchTerm) => {
        setParams(prev => ({ ...prev, search: searchTerm }));
    };

    const filterByCategory = (categoryId) => {
        setParams(prev => ({ ...prev, category: categoryId }));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };



return {products,
        pagination,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        filterByCategory,
        goToPage,
        params,
        fetchProducts
    };
};