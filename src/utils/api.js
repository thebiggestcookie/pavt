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

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const fetchPrompts = async () => {
  try {
    const response = await api.get('/api/prompts');
    console.log("Prompts response:", response.data);
    if (!Array.isArray(response.data)) {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchPrompts:", error);
    throw error;
  }
};

export const createPrompt = async (prompt) => {
  try {
    const response = await api.post('/api/prompts', prompt);
    return response.data;
  } catch (error) {
    console.error("Error in createPrompt:", error);
    throw error;
  }
};

export const updatePrompt = async (id, prompt) => {
  try {
    const response = await api.put(`/api/prompts/${id}`, prompt);
    return response.data;
  } catch (error) {
    console.error("Error in updatePrompt:", error);
    throw error;
  }
};

export const deletePrompt = async (id) => {
  try {
    await api.delete(`/api/prompts/${id}`);
  } catch (error) {
    console.error("Error in deletePrompt:", error);
    throw error;
  }
};

export const generateProduct = async (prompt, llmConfigId) => {
  try {
    const response = await api.post('/api/generate', { prompt, llmConfigId });
    console.log("Generate product response:", response.data);
    if (typeof response.data !== 'object' || !response.data.response) {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error("Error in saveProduct:", error);
    throw error;
  }
};

export const fetchProductsToGrade = async () => {
  try {
    const response = await api.get('/api/products-to-grade');
    console.log("Products to grade response:", response.data);
    if (!Array.isArray(response.data)) {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchProductsToGrade:", error);
    throw error;
  }
};

export const gradeProduct = async (productId, grade) => {
  try {
    const response = await api.post('/api/grade-product', { productId, grade });
    console.log("Grade product response:", response.data);
    if (typeof response.data !== 'object') {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
  } catch (error) {
    console.error("Error in gradeProduct:", error);
    throw error;
  }
};

export const fetchAttributes = async (category, subcategory, searchTerm = '', page = 1, limit = 20) => {
  try {
    const response = await api.get('/api/attributes', {
      params: { category, subcategory, searchTerm, page, limit }
    });
    console.log("Attributes response:", response.data);
    if (!Array.isArray(response.data)) {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchAttributes:", error);
    throw error;
  }
};

export const createAttribute = async (attribute) => {
  try {
    const response = await api.post('/api/attributes', attribute);
    return response.data;
  } catch (error) {
    console.error("Error in createAttribute:", error);
    throw error;
  }
};

export const updateAttribute = async (id, attribute) => {
  try {
    const response = await api.put(`/api/attributes/${id}`, attribute);
    return response.data;
  } catch (error) {
    console.error("Error in updateAttribute:", error);
    throw error;
  }
};

export const deleteAttribute = async (id) => {
  try {
    await api.delete(`/api/attributes/${id}`);
  } catch (error) {
    console.error("Error in deleteAttribute:", error);
    throw error;
  }
};

export const fetchLLMConfigs = async () => {
  try {
    const response = await api.get('/api/llm-configs');
    console.log("LLM Configs response:", response.data);
    if (!Array.isArray(response.data)) {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchLLMConfigs:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    console.log("Categories response:", response.data);
    if (!Array.isArray(response.data)) {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    throw error;
  }
};

export const fetchSubcategories = async (category) => {
  try {
    const response = await api.get('/api/subcategories', { params: { category } });
    console.log("Subcategories response:", response.data);
    if (!Array.isArray(response.data)) {
      throw new Error('Received data is not in the expected format');
    }
    return response.data;
  } catch (error) {
    console.error("Error in fetchSubcategories:", error);
    throw error;
  }
};

export default api;

