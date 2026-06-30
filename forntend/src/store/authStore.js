import { create } from 'zustand';
import { authService } from '../services/authService';

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  login: async (credentials) => {
    set({ loading: true });
    try {
      const data = await authService.login(credentials);
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user || data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const data = await authService.register(payload);
      set({ loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
