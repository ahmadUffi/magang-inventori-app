import api from './api';

export const productService = {
  async getAll(params) {
    const res = await api.get('/products', { params });
    return res.data;
  },
  async getById(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  async create(data) {
    const res = await api.post('/products', data);
    return res.data;
  },
  async update(id, data) {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  async delete(id) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
