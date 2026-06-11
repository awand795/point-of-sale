import api from './axios';

export const settingApi = {
    getAll: () => api.get('/settings'),
    update: (data) => api.put('/settings', data),
};
