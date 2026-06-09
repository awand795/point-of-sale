import axios from 'axios';

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
        // Hanya redirect ke login kalau endpoint /me (auth check) return 401.
        // Di Vercel, PATH_INFO bikin prefix /api hilang, jd route web kena 401
        // meskipun Bearer token valid. Jangan redirect untuk semua 401.
        if (error.response?.status === 401 && error.config?.url === '/me') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;