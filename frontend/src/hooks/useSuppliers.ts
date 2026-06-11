import { useState, useEffect, useCallback } from 'react';
import { supplierApi } from '../api/supplier';

export const useSuppliers = (initialParams = {}) => {
    const [suppliers, setSuppliers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchSuppliers = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await supplierApi.getAll(mergedParams);
            const paginated = response.data.data;
            setSuppliers(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch suppliers');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const createSupplier = async (data) => {
        const response = await supplierApi.create(data);
        await fetchSuppliers();
        return response.data;
    };

    const updateSupplier = async (id, data) => {
        const response = await supplierApi.update(id, data);
        await fetchSuppliers();
        return response.data;
    };

    const deleteSupplier = async (id) => {
        await supplierApi.delete(id);
        setSuppliers(prev => prev.filter(s => s.id !== id));
    };

    const searchSuppliers = (searchTerm) => {
        setParams(prev => ({ ...prev, search: searchTerm }));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        suppliers, pagination, loading, error,
        createSupplier, updateSupplier, deleteSupplier,
        searchSuppliers, goToPage, fetchSuppliers,
    };
};
