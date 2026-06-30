import api from './api';

export const transactionService = {
  async getAll(params) {
    const res = await api.get('/transactions', { params });
    return res.data;
  },
  async create(data) {
    const res = await api.post('/transactions', data);
    return res.data;
  },
};
