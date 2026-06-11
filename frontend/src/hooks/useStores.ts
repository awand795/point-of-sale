import { useState, useEffect, useCallback } from 'react';
import { storeApi } from '../api/store';

export const useStores = (initialParams = {}) => {
    const [stores, setStores] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchStores = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await storeApi.getAll(mergedParams);
            const paginated = response.data.data;
            setStores(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch stores');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const createStore = async (data) => {
        const response = await storeApi.create(data);
        await fetchStores();
        return response.data;
    };

    const updateStore = async (id, data) => {
        const response = await storeApi.update(id, data);
        await fetchStores();
        return response.data;
    };

    const deleteStore = async (id) => {
        await storeApi.delete(id);
        setStores(prev => prev.filter(s => s.id !== id));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        stores, pagination, loading, error,
        createStore, updateStore, deleteStore,
        goToPage, fetchStores,
    };
};
