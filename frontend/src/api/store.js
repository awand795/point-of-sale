import api from './axios';

export const storeApi = {
    getAll: (params) => api.get('/stores', { params }),
    getById: (id) => api.get(`/stores/${id}`),
    create: (data) => api.post('/stores', data),
    update: (id, data) => api.put(`/stores/${id}`, data),
    delete: (id) => api.delete(`/stores/${id}`),
};
