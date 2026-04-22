import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    signup: (userData) => api.post('/auth/signup', userData),
    verifyOTP: (data) => api.post('/auth/verify-otp', data),
    resendOTP: (email) => api.post('/auth/resend-otp', { email }),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
};

export default api;
