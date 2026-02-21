import { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../api/category';

export const useCategories = (initialParams = {}) => {
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchCategories = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await categoryApi.getAll(mergedParams);
            const paginated = response.data.data;
            setCategories(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCategory = async (categoryData) => {
        try {
            const response = await categoryApi.create(categoryData);
            await fetchCategories();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category');
            throw err;
        }
    };

    const updateCategory = async (id, categoryData) => {
        try {
            const response = await categoryApi.update(id, categoryData);
            await fetchCategories();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update category');
            throw err;
        }
    };

    const deleteCategory = async (id) => {
        try {
            await categoryApi.delete(id);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete category');
            throw err;
        }
    };

    const searchCategories = (searchTerm) => {
        setParams(prev => ({ ...prev, search: searchTerm }));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        categories,
        pagination,
        loading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        searchCategories,
        goToPage,
        params,
        fetchCategories,
    };
};
