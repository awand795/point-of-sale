import { useState, useEffect, useCallback } from 'react';
import { discountApi } from '../api/discount';

export const useDiscounts = (initialParams = {}) => {
    const [discounts, setDiscounts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchDiscounts = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await discountApi.getAll(mergedParams);
            const paginated = response.data.data;
            setDiscounts(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch discounts');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchDiscounts();
    }, [fetchDiscounts]);

    const createDiscount = async (data) => {
        const response = await discountApi.create(data);
        await fetchDiscounts();
        return response.data;
    };

    const updateDiscount = async (id, data) => {
        const response = await discountApi.update(id, data);
        await fetchDiscounts();
        return response.data;
    };

    const deleteDiscount = async (id) => {
        await discountApi.delete(id);
        setDiscounts(prev => prev.filter(d => d.id !== id));
    };

    const searchDiscounts = (searchTerm) => {
        setParams(prev => ({ ...prev, search: searchTerm }));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        discounts, pagination, loading, error,
        createDiscount, updateDiscount, deleteDiscount,
        searchDiscounts, goToPage, fetchDiscounts,
    };
};
