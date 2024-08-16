import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};

export const updateProduct = async (productId, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/products/${productId}`, updatedData);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

export const addUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
};

export const removeUser = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
  return response.data;
};

export const resetPassword = async (userId) => {
  const response = await axios.post(`${API_BASE_URL}/users/${userId}/reset-password`);
  return response.data;
};

export const fetchAttributes = async () => {
  const response = await axios.get(`${API_BASE_URL}/attributes`);
  return response.data;
};

export const updateAttributes = async (updatedAttributes) => {
  const response = await axios.put(`${API_BASE_URL}/attributes`, updatedAttributes);
  return response.data;
};

export const fetchPrompts = async () => {
  const response = await axios.get(`${API_BASE_URL}/prompts`);
  return response.data;
};

export const addPrompt = async (promptData) => {
  const response = await axios.post(`${API_BASE_URL}/prompts`, promptData);
  return response.data;
};

export const updatePrompt = async (promptId, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/prompts/${promptId}`, updatedData);
  return response.data;
};

export const deletePrompt = async (promptId) => {
  const response = await axios.delete(`${API_BASE_URL}/prompts/${promptId}`);
  return response.data;
};

export const fetchApiKeys = async () => {
  const response = await axios.get(`${API_BASE_URL}/api-keys`);
  return response.data;
};

export const updateApiKey = async (provider, apiKey) => {
  const response = await axios.put(`${API_BASE_URL}/api-keys/${provider}`, { apiKey });
  return response.data;
};

export const getTokenUsage = async () => {
  const response = await axios.get(`${API_BASE_URL}/token-usage`);
  return response.data;
};

export const fetchLlmConfigs = async () => {
  const response = await axios.get(`${API_BASE_URL}/llm-configs`);
  return response.data;
};

export const updateLlmConfig = async (configData) => {
  const response = await axios.put(`${API_BASE_URL}/llm-configs/${configData.id}`, configData);
  return response.data;
};

export const fetchSubcategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/subcategories`);
  return response.data;
};

export const addSubcategory = async (subcategoryData) => {
  const response = await axios.post(`${API_BASE_URL}/subcategories`, subcategoryData);
  return response.data;
};

export const deleteSubcategory = async (subcategoryId) => {
  const response = await axios.delete(`${API_BASE_URL}/subcategories/${subcategoryId}`);
  return response.data;
};