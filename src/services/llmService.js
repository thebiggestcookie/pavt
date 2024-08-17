import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const processWithLLM = async (prompt, productName, llmConfig) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/process-llm`, {
      prompt,
      productName,
      llmConfig
    });
    return response.data;
  } catch (error) {
    console.error('Error processing with LLM:', error);
    throw error;
  }
};

