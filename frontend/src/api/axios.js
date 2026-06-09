import axios from 'axios';
import { handleDemoRequest } from './demoData';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

api.interceptors.request.use(
    (config) => {
        const isDemo = localStorage.getItem('isDemo') === 'true';

        // DEMO MODE: intercept all requests and return mock data
        if (isDemo) {
            const method = config.method?.toLowerCase() || 'get';
            const url = config.url || '';
            let data = config.data;

            if (typeof data === 'string') {
                try { data = JSON.parse(data); } catch (e) { /* ignore */ }
            }

            const response = handleDemoRequest(method, url, data, config.params);

            // Simulate realistic network delay
            const delay = method === 'get' ? 200 : 300;
            return new Promise((resolve) => {
                setTimeout(() => resolve({ ...response, config }), delay);
            });
        }

        // Normal mode: add auth token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);  

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // In demo mode, don't redirect on 401
        if (localStorage.getItem('isDemo') !== 'true') {
            if (error.response?.status === 401 && error.config?.url === '/me') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;