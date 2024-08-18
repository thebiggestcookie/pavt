import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchPrompts = () => api.get('/api/prompts');
export const generateProduct = (prompt) => api.post('/api/generate', { prompt });
export const saveProduct = (product) => api.post('/api/products', product);
export const fetchProductsToGrade = () => api.get('/api/products-to-grade');
export const gradeProduct = (productId, grade) => api.post('/api/grade-product', { productId, grade });

export default api;

