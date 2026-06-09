import api from './axios';

export const notificationApi = {
    getAll: (params) => api.get('/notifications', { params }),
    markAsRead: (id) => api.post(`/notifications/${id}/read`),
    markAllAsRead: () => api.post('/notifications/read-all'),
    unreadCount: () => api.get('/notifications/unread-count'),
};
