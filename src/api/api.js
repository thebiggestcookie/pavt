import axios from 'axios';
import debugLogger from '../utils/debugLogger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    debugLogger(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    debugLogger('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    debugLogger(`API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    debugLogger('API Response Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    debugLogger('Error in fetchProducts:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await api.put(`/products/${productId}`, updatedData);
    return response.data;
  } catch (error) {
    debugLogger('Error in updateProduct:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    debugLogger('Error in fetchUsers:', error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    debugLogger('Error in addUser:', error);
    throw error;
  }
};

export const removeUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    debugLogger('Error in removeUser:', error);
    throw error;
  }
};

export const resetPassword = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    debugLogger('Error in resetPassword:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    debugLogger('Error in updateUser:', error);
    throw error;
  }
};

export const fetchAttributes = async () => {
  try {
    const response = await api.get('/attributes');
    return response.data;
  } catch (error) {
    debugLogger('Error in fetchAttributes:', error);
    throw error;
  }
};

export const updateAttributes = async (updatedAttributes) => {
  try {
    const response = await api.put('/attributes', updatedAttributes);
    return response.data;
  } catch (error) {
    debugLogger('Error in updateAttributes:', error);
    throw error;
  }
};

export const fetchPrompts = async () => {
  try {
    const response = await api.get('/prompts');
    return response.data;
  } catch (error) {
    debugLogger('Error in fetchPrompts:', error);
    throw error;
  }
};

export const addPrompt = async (promptData) => {
  try {
    const response = await api.post('/prompts', promptData);
    return response.data;
  } catch (error) {
    debugLogger('Error in addPrompt:', error);
    throw error;
  }
};

export const updatePrompt = async (promptId, updatedData) => {
  try {
    const response = await api.put(`/prompts/${promptId}`, updatedData);
    return response.data;
  } catch (error) {
    debugLogger('Error in updatePrompt:', error);
    throw error;
  }
};

export const deletePrompt = async (promptId) => {
  try {
    const response = await api.delete(`/prompts/${promptId}`);
    return response.data;
  } catch (error) {
    debugLogger('Error in deletePrompt:', error);
    throw error;
  }
};

export const fetchApiKeys = async () => {
  try {
    const response = await api.get('/api-keys');
    return response.data;
  } catch (error) {
    debugLogger('Error in fetchApiKeys:', error);
    throw error;
  }
};

export const updateApiKey = async (provider, apiKey) => {
  try {
    const response = await api.put(`/api-keys/${provider}`, { apiKey });
    return response.data;
  } catch (error) {
    debugLogger('Error in updateApiKey:', error);
    throw error;
  }
};

export const getTokenUsage = async () => {
  try {
    const response = await api.get('/token-usage');
    return response.data;
  } catch (error) {
    debugLogger('Error in getTokenUsage:', error);
    throw error;
  }
};

export const fetchLlmConfigs = async () => {
  try {
    const response = await api.get('/llm-configs');
    return response.data;
  } catch (error) {
    debugLogger('Error in fetchLlmConfigs:', error);
    throw error;
  }
};

export const updateLlmConfig = async (configData) => {
  try {
    let response;
    if (configData.id) {
      response = await api.put(`/llm-configs/${configData.id}`, configData);
    } else {
      response = await api.post('/llm-configs', configData);
    }
    return response.data;
  } catch (error) {
    debugLogger('Error in updateLlmConfig:', error);
    throw error;
  }
};

export const fetchSubcategories = async () => {
  try {
    const response = await api.get('/subcategories');
    return response.data;
  } catch (error) {
    debugLogger('Error in fetchSubcategories:', error);
    throw error;
  }
};

export const addSubcategory = async (subcategoryData) => {
  try {
    const response = await api.post('/subcategories', subcategoryData);
    return response.data;
  } catch (error) {
    debugLogger('Error in addSubcategory:', error);
    throw error;
  }
};

export const deleteSubcategory = async (subcategoryId) => {
  try {
    const response = await api.delete(`/subcategories/${subcategoryId}`);
    return response.data;
  } catch (error) {
    debugLogger('Error in deleteSubcategory:', error);
    throw error;
  }
};

