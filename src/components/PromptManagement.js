import React, { useState, useEffect } from 'react';
import { fetchPrompts, addPrompt, updatePrompt, deletePrompt, fetchApiKeys, updateApiKey } from '../api/api';

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '', model: 'gpt-4' });
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    perplexity: ''
  });

  useEffect(() => {
    loadPrompts();
    loadApiKeys();
  }, []);

  const loadPrompts = async () => {
    try {
      const promptsData = await fetchPrompts();
      setPrompts(promptsData);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  const loadApiKeys = async () => {
    try {
      const keys = await fetchApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrompt({ ...newPrompt, [name]: value });
  };

  const handleApiKeyChange = async (e) => {
    const { name, value } = e.target;
    try {
      await updateApiKey(name, value);
      setApiKeys({ ...apiKeys, [name]: value });
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const handleAddPrompt = async () => {
    if (newPrompt.name && newPrompt.content) {
      try {
        const addedPrompt = await addPrompt(newPrompt);
        setPrompts([...prompts, addedPrompt]);
        setNewPrompt({ name: '', content: '', model: 'gpt-4' });
      } catch (error) {
        console.error('Error adding prompt:', error);
      }
    }
  };

  const handleEditPrompt = async (id) => {
    const promptToEdit = prompts.find(prompt => prompt.id === id);
    if (promptToEdit) {
      setNewPrompt({ ...promptToEdit });
      await deletePrompt(id);
      setPrompts(prompts.filter(prompt => prompt.id !== id));
    }
  };

  const handleDeletePrompt = async (id) => {
    try {
      await deletePrompt(id);
      setPrompts(prompts.filter(prompt => prompt.id !== id));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Prompt Management</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">API Keys</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(apiKeys).map(([provider, key]) => (
            <div key={provider}>
              <label className="block mb-2">{provider.charAt(0).toUpperCase() + provider.slice(1)} API Key</label>
              <input
                type="password"
                name={provider}
                value={key}
                onChange={handleApiKeyChange}
                className="w-full p-2 border rounded"
                placeholder={`Enter ${provider} API key`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={newPrompt.name}
          onChange={handleInputChange}
          placeholder="Prompt Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          name="content"
          value={newPrompt.content}
          onChange={handleInputChange}
          placeholder="Prompt Content"
          className="w-full p-2 mb-2 border rounded"
          rows="3"
        ></textarea>
        <select
          name="model"
          value={newPrompt.model}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="gpt-4">OpenAI GPT-4</option>
          <option value="claude">Anthropic Claude</option>
          <option value="perplexity">Perplexity Labs</option>
        </select>
        <button
          onClick={handleAddPrompt}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add/Update Prompt
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Prompts</h3>
        {prompts.map((prompt) => (
          <div key={prompt.id} className="mb-4 p-4 border rounded">
            <h4 className="font-bold">{prompt.name}</h4>
            <p className="mb-2">{prompt.content}</p>
            <p className="mb-2">Model: {prompt.model}</p>
            <button
              onClick={() => handleEditPrompt(prompt.id)}
              className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeletePrompt(prompt.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptManagement;

