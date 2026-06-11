import { useState, useEffect, useCallback } from 'react';
import { transactionApi } from '../api/transactions';

export const useTransactions = (initialParams = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);
    const [dashboard, setDashboard] = useState(null);

    const fetchDashboard = useCallback(async () => {
        try {
            const response = await transactionApi.getDashboard();
            setDashboard(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard');
        }
    }, []);

    const fetchTransactions = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await transactionApi.getAll(mergedParams);
            const paginated = response.data.data;
            setTransactions(paginated.data);
            setPagination({
                current_page: paginated.current_page,
                last_page: paginated.last_page,
                total: paginated.total,
                per_page: paginated.per_page,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    }, [params]);

    const createTransaction = async (transactionData) => {
        try {
            const response = await transactionApi.create(transactionData);
            await fetchDashboard();
            return {
                success: true,
                data: response.data
            };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to create transaction'
            };
        }
    };

    const cancelTransaction = async (transactionId) => {
        try {
            await transactionApi.cancel(transactionId);
            await fetchTransactions();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to cancel transaction'
            };
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filterByDate = (date) => {
        setParams(prev => ({ ...prev, date }));
    };

    const filterByStatus = (status) => {
        setParams(prev => {
            const next = { ...prev };
            if (status) {
                next.status = status;
            } else {
                delete next.status;
            }
            return next;
        });
    };

    const filterByType = (type) => {
        setParams(prev => {
            const next = { ...prev };
            if (type) {
                next.type = type;
            } else {
                delete next.type;
            }
            return next;
        });
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        transactions,
        pagination,
        loading,
        error,
        dashboard,
        fetchTransactions,
        createTransaction,
        cancelTransaction,
        fetchDashboard,
        filterByDate,
        filterByStatus,
        filterByType,
        goToPage,
        params,
    };
};
