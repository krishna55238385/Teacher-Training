import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Create generic axios instance
const api = axios.create({
    baseURL: import.'https://teachertraining.bambinos.live',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if we're already on the login page
            const isLoginRequest = error.config?.url?.includes('/auth/login');
            if (!isLoginRequest) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
