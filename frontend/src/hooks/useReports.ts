import { useState, useEffect, useCallback } from 'react';
import { reportApi } from '../api/report';

export const useReports = (initialParams = {}) => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    const fetchReports = useCallback(async (newParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...params, ...newParams };
            const response = await reportApi.getAll(mergedParams);
            setReports(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const filterByDate = (startDate, endDate) => {
        setParams(prev => ({ ...prev, start_date: startDate, end_date: endDate }));
    };

    const goToPage = (page) => {
        setParams(prev => ({ ...prev, page }));
    };

    return {
        reports, loading, error,
        filterByDate, goToPage, fetchReports,
    };
};
