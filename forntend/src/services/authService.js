import api from './api';

export const authService = {
  async login(data) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  async logout() {
    // JWT stateless — no server-side session to invalidate, client clears token
  },
  async me() {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
