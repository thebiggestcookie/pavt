import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const fetchSubcategories = async () => {
  const response = await api.get('/subcategories');
  return response.data;
};

export const fetchAttributes = async () => {
  const response = await api.get('/attributes');
  return response.data;
};

export const updateAttribute = async (id, attribute) => {
  const response = await api.put(`/attributes/${id}`, attribute);
  return response.data;
};

export const createAttribute = async (attribute) => {
  const response = await api.post('/attributes', attribute);
  return response.data;
};

export const deleteAttribute = async (id) => {
  const response = await api.delete(`/attributes/${id}`);
  return response.data;
};

export const fetchPrompts = async () => {
  const response = await api.get('/prompts');
  return response.data;
};

export const updatePrompt = async (id, prompt) => {
  const response = await api.put(`/prompts/${id}`, prompt);
  return response.data;
};

export const generateProduct = async (prompt, llmConfig) => {
  const response = await api.post('/generate-product', { prompt, llmConfig });
  return response.data;
};

export const saveProduct = async (product) => {
  const response = await api.post('/products', product);
  return response.data;
};

export const fetchProductsToGrade = async () => {
  const response = await api.get('/products-to-grade');
  return response.data;
};

export const gradeProduct = async (id, grade, feedback) => {
  const response = await api.post(`/grade-product/${id}`, { grade, feedback });
  return response.data;
};

export const fetchLLMConfigs = async () => {
  const response = await api.get('/llm-configs');
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUser = async (id, updates) => {
  const response = await api.put(`/users/${id}`, updates);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const fetchReports = async () => {
  const response = await api.get('/reports');
  return response.data;
};

export const testPrompt = async (prompt) => {
  const response = await api.post('/test-prompt', { prompt });
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};