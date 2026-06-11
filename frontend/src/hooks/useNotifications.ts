import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notification';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await notificationApi.getAll();
            const paginated = response.data.data;
            setNotifications(paginated.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await notificationApi.unreadCount();
            setUnreadCount(response.data.data?.count || 0);
        } catch {}
    }, []);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount]);

    const markAsRead = async (id) => {
        await notificationApi.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await notificationApi.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    return {
        notifications, unreadCount, loading, error,
        markAsRead, markAllAsRead,
        fetchNotifications, fetchUnreadCount,
    };
};
