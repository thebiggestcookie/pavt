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

// ... (keep all other functions unchanged)

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

// ... (keep all other functions unchanged)