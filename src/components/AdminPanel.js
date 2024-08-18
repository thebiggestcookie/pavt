import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({
    name: '',
    provider: '',
    model: '',
    apiKey: '',
    maxTokens: ''
  });
  const [error, setError] = useState('');

  const providerModels = {
    openai: ['gpt-4', 'gpt-3.5-turbo', 'text-davinci-002', 'text-curie-001'],
    anthropic: ['claude-v1', 'claude-instant-v1'],
    perplexity: ['pplx-7b-chat', 'pplx-70b-chat']
  };

  useEffect(() => {
    fetchLlmConfigs();
  }, []);

  const fetchLlmConfigs = async () => {
    try {
      const response = await axios.get('/api/llm-configs');
      setLlmConfigs(response.data);
    } catch (error) {
      console.error('Error fetching LLM configs:', error);
      setError('Failed to fetch LLM configurations');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/llm-configs', newConfig);
      setNewConfig({
        name: '',
        provider: '',
        model: '',
        apiKey: '',
        maxTokens: ''
      });
      fetchLlmConfigs();
    } catch (error) {
      console.error('Error adding LLM config:', error);
      setError('Failed to add LLM configuration. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/llm-configs/${id}`);
      fetchLlmConfigs();
    } catch (error) {
      console.error('Error deleting LLM config:', error);
      setError('Failed to delete LLM configuration');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <h2 className="text-xl font-semibold mb-2">LLM Configurations</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newConfig.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="provider" className="block text-gray-700 text-sm font-bold mb-2">Provider:</label>
          <select
            id="provider"
            name="provider"
            value={newConfig.provider}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a provider</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="perplexity">Perplexity</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="model" className="block text-gray-700 text-sm font-bold mb-2">Model:</label>
          <select
            id="model"
            name="model"
            value={newConfig.model}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a model</option>
            {newConfig.provider && providerModels[newConfig.provider].map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-gray-700 text-sm font-bold mb-2">API Key:</label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            value={newConfig.apiKey}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maxTokens" className="block text-gray-700 text-sm font-bold mb-2">Max Tokens:</label>
          <input
            type="number"
            id="maxTokens"
            name="maxTokens"
            value={newConfig.maxTokens}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Configuration
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Configurations</h3>
        {llmConfigs.map(config => (
          <div key={config.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <p><strong>Name:</strong> {config.name}</p>
            <p><strong>Provider:</strong> {config.provider}</p>
            <p><strong>Model:</strong> {config.model}</p>
            <p><strong>Max Tokens:</strong> {config.max_tokens}</p>
            <button
              onClick={() => handleDelete(config.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
