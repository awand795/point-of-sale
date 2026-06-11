import { useState, useEffect, useCallback } from 'react';
import { purchaseApi } from '../api/purchase';

export const usePurchases = (initialParams = {}) => {
    const [purchases, setPurchases] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchPurchases = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await purchaseApi.getAll(mergedParams);
            const paginated = response.data.data;
            setPurchases(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch purchases');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchPurchases();
    }, [fetchPurchases]);

    const createPurchase = async (data) => {
        const response = await purchaseApi.create(data);
        await fetchPurchases();
        return response.data;
    };

    const receivePurchase = async (id) => {
        const response = await purchaseApi.receive(id);
        await fetchPurchases();
        return response.data;
    };

    const filterByStatus = (status) => {
        setParams(prev => ({ ...prev, status: status || undefined }));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        purchases, pagination, loading, error,
        createPurchase, receivePurchase,
        filterByStatus, goToPage, fetchPurchases,
    };
};
