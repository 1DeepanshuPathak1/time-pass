import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const itemsAPI = {
  getItems: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/items?${params.toString()}`);
  },
  getItem: (id) => api.get(`/items/${id}`),
  getItemByUniqueId: (uniqueId) => api.get(`/items/by-unique-id/${uniqueId}`),
  createItem: (formData) => api.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  claimItem: (id) => api.put(`/items/${id}/claim`),
  getCategories: () => api.get('/categories'),
};

export default api;