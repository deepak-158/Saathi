import axios from 'axios';

const RAW_API = import.meta.env.VITE_API_URL || '/api';
export const API_BASE = RAW_API.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Profile
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.patch('/profile', data),
};

// Chat
export const chatAPI = {
  getConversations: (page = 1) => api.get(`/conversations?page=${page}&limit=20`),
  getConversation: (id) => api.get(`/conversations/${id}`),
  deleteConversation: (id) => api.delete(`/conversations/${id}`),
  updateConversation: (id, data) => api.patch(`/conversations/${id}`, data),
  getMessages: (id, page = 1) => api.get(`/conversations/${id}/messages?page=${page}&limit=50`),
  // Streaming chat uses EventSource/fetch, not axios
};

// Memory
export const memoryAPI = {
  getAll: (category) => api.get(`/memories${category ? `?category=${category}` : ''}`),
  create: (data) => api.post('/memories', data),
  update: (id, data) => api.patch(`/memories/${id}`, data),
  delete: (id) => api.delete(`/memories/${id}`),
};

// Goals
export const goalAPI = {
  getAll: (status) => api.get(`/goals${status ? `?status=${status}` : ''}`),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.patch(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Check-ins
export const checkinAPI = {
  create: (data) => api.post('/checkins', data),
  getAll: (limit = 30) => api.get(`/checkins?limit=${limit}`),
};

// Usage
export const usageAPI = {
  get: () => api.get('/usage'),
};

export default api;
