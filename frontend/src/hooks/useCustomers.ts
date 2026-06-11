import { useState, useEffect, useCallback } from 'react';
import { customerApi } from '../api/customer';

export const useCustomers = (initialParams = {}) => {
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchCustomers = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await customerApi.getAll(mergedParams);
            const paginated = response.data.data;
            setCustomers(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const createCustomer = async (data) => {
        const response = await customerApi.create(data);
        await fetchCustomers();
        return response.data;
    };

    const updateCustomer = async (id, data) => {
        const response = await customerApi.update(id, data);
        await fetchCustomers();
        return response.data;
    };

    const deleteCustomer = async (id) => {
        await customerApi.delete(id);
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    const searchCustomers = (searchTerm) => {
        setParams(prev => ({ ...prev, search: searchTerm }));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        customers, pagination, loading, error,
        createCustomer, updateCustomer, deleteCustomer,
        searchCustomers, goToPage, fetchCustomers,
    };
};
