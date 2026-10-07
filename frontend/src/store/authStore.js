import { create } from 'zustand';
import { authAPI, profileAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state from stored token
  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const res = await authAPI.getMe();
      set({ user: res.data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  register: async (data) => {
    set({ error: null });
    try {
      const res = await authAPI.register(data);
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, error: null });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      set({ error: message });
      return { success: false, message };
    }
  },

  login: async (data) => {
    set({ error: null });
    try {
      const res = await authAPI.login(data);
      const { user, token } = res.data.data;
      localStorage.setItem('token', token);
      sessionStorage.removeItem('saathi_session_mood');
      set({ user, isAuthenticated: true, error: null });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      set({ error: message });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    sessionStorage.removeItem('saathi_session_mood');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const res = await profileAPI.update(data);
      set({ user: res.data.data.user });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed.' };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
