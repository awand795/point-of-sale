import api from './axios';

export const discountApi = {
    getAll: (params) => api.get('/discounts', { params }),
    getById: (id) => api.get(`/discounts/${id}`),
    create: (data) => api.post('/discounts', data),
    update: (id, data) => api.put(`/discounts/${id}`, data),
    delete: (id) => api.delete(`/discounts/${id}`),
};
