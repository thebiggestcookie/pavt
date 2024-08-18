import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromptTester = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [productName, setProductName] = useState('');
  const [llmResponse, setLlmResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await axios.get('/api/prompts');
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/process-llm', {
        prompt: selectedPrompt,
        productName: productName
      });
      setLlmResponse(response.data.attributes);
    } catch (error) {
      console.error('Error processing LLM:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Prompt Tester</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-gray-700 text-sm font-bold mb-2">
            Select Prompt:
          </label>
          <select
            id="prompt"
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a prompt</option>
            {prompts.map(prompt => (
              <option key={prompt.id} value={prompt.content}>{prompt.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">
            Product Name:
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Test Prompt'}
        </button>
      </form>
      {llmResponse && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-2">LLM Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(llmResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PromptTester;