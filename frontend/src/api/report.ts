import api from './axios';

export const reportApi = {
    getAll: (params) => api.get('/reports', { params }),
    dashboard: () => api.get('/dashboard'),
};
