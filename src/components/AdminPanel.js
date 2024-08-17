import React, { useState, useEffect } from 'react';
import { fetchLlmConfigs, updateLlmConfig, fetchSubcategories, addSubcategory, deleteSubcategory } from '../api/api';
import debugLogger from '../utils/debugLogger';

const AdminPanel = () => {
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newLlmConfig, setNewLlmConfig] = useState({ name: '', apiKey: '', maxTokens: 0, model: 'gpt-4' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', parentCategory: 'Coffee' });

  useEffect(() => {
    loadLlmConfigs();
    loadSubcategories();
  }, []);

  const loadLlmConfigs = async () => {
    try {
      const configs = await fetchLlmConfigs();
      setLlmConfigs(configs);
    } catch (error) {
      console.error('Error loading LLM configs:', error);
    }
  };

  const loadSubcategories = async () => {
    try {
      const categories = await fetchSubcategories();
      setSubcategories(categories);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const handleLlmConfigChange = (e, index) => {
    const { name, value } = e.target;
    const updatedConfigs = [...llmConfigs];
    updatedConfigs[index] = { ...updatedConfigs[index], [name]: value };
    setLlmConfigs(updatedConfigs);
  };

  const handleUpdateLlmConfig = async (index) => {
    try {
      const configToUpdate = llmConfigs[index];
      debugLogger('Updating LLM config:', configToUpdate);
      if (!configToUpdate.id) {
        throw new Error('LLM config ID is undefined');
      }
      await updateLlmConfig(configToUpdate);
      alert('LLM configuration updated successfully');
    } catch (error) {
      console.error('Error updating LLM config:', error);
      alert(`Error updating LLM config: ${error.message}`);
    }
  };

  const handleAddLlmConfig = async () => {
    try {
      debugLogger('Adding new LLM config:', newLlmConfig);
      const addedConfig = await updateLlmConfig(newLlmConfig);
      setLlmConfigs([...llmConfigs, addedConfig]);
      setNewLlmConfig({ name: '', apiKey: '', maxTokens: 0, model: 'gpt-4' });
    } catch (error) {
      console.error('Error adding LLM config:', error);
      alert(`Error adding LLM config: ${error.message}`);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      const addedSubcategory = await addSubcategory(newSubcategory);
      setSubcategories([...subcategories, addedSubcategory]);
      setNewSubcategory({ name: '', parentCategory: 'Coffee' });
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await deleteSubcategory(id);
      setSubcategories(subcategories.filter(subcategory => subcategory.id !== id));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">LLM Configurations</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">API Key</th>
              <th className="border p-2">Max Tokens</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {llmConfigs.map((config, index) => (
              <tr key={config.id}>
                <td className="border p-2">
                  <input
                    type="text"
                    name="name"
                    value={config.name}
                    onChange={(e) => handleLlmConfigChange(e, index)}
                    className="w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="password"
                    name="apiKey"
                    value={config.apiKey}
                    onChange={(e) => handleLlmConfigChange(e, index)}
                    className="w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    name="maxTokens"
                    value={config.maxTokens}
                    onChange={(e) => handleLlmConfigChange(e, index)}
                    className="w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <select
                    name="model"
                    value={config.model}
                    onChange={(e) => handleLlmConfigChange(e, index)}
                    className="w-full p-1"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude">Claude</option>
                    <option value="perplexity">Perplexity Labs</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleUpdateLlmConfig(index)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Name"
            value={newLlmConfig.name}
            onChange={(e) => setNewLlmConfig({ ...newLlmConfig, name: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <input
            type="password"
            placeholder="API Key"
            value={newLlmConfig.apiKey}
            onChange={(e) => setNewLlmConfig({ ...newLlmConfig, apiKey: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <input
            type="number"
            placeholder="Max Tokens"
            value={newLlmConfig.maxTokens}
            onChange={(e) => setNewLlmConfig({ ...newLlmConfig, maxTokens: parseInt(e.target.value) })}
            className="p-2 border rounded mr-2"
          />
          <select
            value={newLlmConfig.model}
            onChange={(e) => setNewLlmConfig({ ...newLlmConfig, model: e.target.value })}
            className="p-2 border rounded mr-2"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="claude">Claude</option>
            <option value="perplexity">Perplexity Labs</option>
          </select>
          <button
            onClick={handleAddLlmConfig}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add LLM Config
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Subcategories</h3>
        <ul className="list-disc list-inside">
          {subcategories.map((subcategory) => (
            <li key={subcategory.id}>
              {subcategory.name}
              <button
                onClick={() => handleDeleteSubcategory(subcategory.id)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Subcategory Name"
            value={newSubcategory.name}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleAddSubcategory}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Subcategory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

