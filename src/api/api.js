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

