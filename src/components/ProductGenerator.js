import React, { useState, useEffect } from 'react';
import { fetchPrompts, processWithLLM, fetchLlmConfigs } from '../api/api';

const ProductGenerator = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [productName, setProductName] = useState('');
  const [generatedAttributes, setGeneratedAttributes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');

  useEffect(() => {
    loadPrompts();
    loadLlmConfigs();
  }, []);

  const loadPrompts = async () => {
    try {
      const promptsData = await fetchPrompts();
      setPrompts(promptsData);
    } catch (error) {
      console.error('Error loading prompts:', error);
      setError('Failed to load prompts. Please try again.');
    }
  };

  const loadLlmConfigs = async () => {
    try {
      const configs = await fetchLlmConfigs();
      setLlmConfigs(configs);
    } catch (error) {
      console.error('Error loading LLM configs:', error);
      setError('Failed to load LLM configurations. Please try again.');
    }
  };

  const handlePromptChange = (e) => {
    const prompt = prompts.find(p => p.id === e.target.value);
    setSelectedPrompt(prompt);
    setEditedPrompt(prompt ? prompt.content : '');
  };

  const handleGenerateAttributes = async () => {
    if (!selectedPrompt || !productName) {
      setError('Please select a prompt and enter a product name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await processWithLLM(editedPrompt, productName, llmConfigs[0]);
      setGeneratedAttributes(result.attributes);
    } catch (error) {
      console.error('Error generating attributes:', error);
      setError('Failed to generate attributes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPrompt = () => {
    setShowPrompt(!showPrompt);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Product Generator</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Select Prompt</label>
        <select
          value={selectedPrompt ? selectedPrompt.id : ''}
          onChange={handlePromptChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a prompt</option>
          {prompts.map(prompt => (
            <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter product name"
        />
      </div>

      <button
        onClick={toggleShowPrompt}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {showPrompt ? 'Hide Prompt' : 'Show/Modify Prompt'}
      </button>

      {showPrompt && (
        <div className="mb-4">
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows="6"
          />
        </div>
      )}

      <button
        onClick={handleGenerateAttributes}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Attributes'}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {generatedAttributes && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Generated Attributes:</h3>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(generatedAttributes, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductGenerator;