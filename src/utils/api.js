import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://pavt-db.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
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
  console.error("API Error:", error);
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
    console.error("Response headers:", error.response.headers);
  } else if (error.request) {
    console.error("Request error:", error.request);
  } else {
    console.error("Error message:", error.message);
  }
  return Promise.reject(error);
});

export const fetchPrompts = async () => {
  try {
    const response = await api.get('/api/prompts');
    console.log("Prompts response:", response.data);
    if (!Array.isArray(response.data)) {
      throw new Error('Received data is not in the expected format');
    }
    return response;
  } catch (error) {
    console.error("Error in fetchPrompts:", error);
    throw error;
  }
};

export const generateProduct = async (prompt) => {
  try {
    const response = await api.post('/api/generate', { prompt });
    console.log("Generate product response:", response.data);
    if (typeof response.data !== 'object' || !response.data.response) {
      throw new Error('Received data is not in the expected format');
    }
    return response;
  } catch (error) {
    console.error("Error in generateProduct:", error);
    throw error;
  }
};

export const saveProduct = async (product) => {
  try {
    const response = await api.post('/api/products', product);
    console.log("Save product response:", response.data);
    if (typeof response.data !== 'object') {
      throw new Error('Received data is not in the expected format');
    }
    return response;
  } catch (error) {
    console.error("Error in saveProduct:", error);
    throw error;
  }
};

export const fetchProductsToGrade = async () => {

  }
};

export default api;

