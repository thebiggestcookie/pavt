import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://pavt-db.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
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

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    console.error("Response error:", error.response.data);
    console.error("Status:", error.response.status);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    console.error("Request error:", error.request);
  } else {
    console.error("Error:", error.message);
  }
  return Promise.reject(error);
});

export const fetchPrompts = async () => {
  const response = await api.get('/api/prompts');
  if (!Array.isArray(response.data)) {
    throw new Error('Received data is not in the expected format');
  }
  return response;
};

export const generateProduct = async (prompt) => {
  const response = await api.post('/api/generate', { prompt });
  if (typeof response.data !== 'object' || !response.data.response) {
    throw new Error('Received data is not in the expected format');
  }
  return response;
};

export const saveProduct = async (product) => {
  const response = await api.post('/api/products', product);
  if (typeof response.data !== 'object') {
    throw new Error('Received data is not in the expected format');
  }
  return response;
};

export const fetchProductsToGrade = async () => {
  const response = await api.get('/api/products');
  if (!Array.isArray(response.data)) {
    throw new Error('Received data is not in the expected format');
  }
  return response.data.filter(product => !product.human_verified);
};

export const gradeProduct = async (productId, humanAttributes) => {
  const response = await api.put(`/api/products/${productId}`, { human_attributes: humanAttributes, human_verified: true });
  if (typeof response.data !== 'object') {
    throw new Error('Received data is not in the expected format');
  }
  return response;
};

export default api;

