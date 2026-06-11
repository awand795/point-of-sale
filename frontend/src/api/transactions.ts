import api from './axios';

export const transactionApi = {
    getAll: (params) => api.get('/transactions', { params }),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post('/transactions', data),
    cancel: (id) => api.post(`/transactions/${id}/cancel`),
    getDashboard: () => api.get('/dashboard'),
};