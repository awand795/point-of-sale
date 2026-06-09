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
        // Jangan langsung hapus token & redirect di sini.
        // Di Vercel, PATH_INFO bikin prefix /api hilang, jd route web yg pake session
        // kena 401 meskipun Bearer token valid. Biarkan masing2 komponen handle error.
        return Promise.reject(error);
    }
);

export default api;