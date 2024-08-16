import React, { useState } from 'react';

const AdminPanel = () => {
  const [llmConfigs, setLlmConfigs] = useState([
    { id: 1, name: 'GPT-3', apiKey: '********', maxTokens: 100 },
    { id: 2, name: 'BERT', apiKey: '********', maxTokens: 50 },
  ]);

  const [subcategories, setSubcategories] = useState([
    { id: 1, name: 'Whole Bean Coffee' },
    { id: 2, name: 'Ground Coffee' },
    { id: 3, name: 'Instant Coffee' },
  ]);

  const [newLlmConfig, setNewLlmConfig] = useState({ name: '', apiKey: '', maxTokens: 0 });
  const [newSubcategory, setNewSubcategory] = useState('');

  const addLlmConfig = () => {
    if (newLlmConfig.name && newLlmConfig.apiKey) {
      setLlmConfigs([...llmConfigs, { ...newLlmConfig, id: llmConfigs.length + 1 }]);
      setNewLlmConfig({ name: '', apiKey: '', maxTokens: 0 });
    }
  };

  const addSubcategory = () => {
    if (newSubcategory) {
      setSubcategories([...subcategories, { id: subcategories.length + 1, name: newSubcategory }]);
      setNewSubcategory('');
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
            </tr>
          </thead>
          <tbody>
            {llmConfigs.map((config) => (
              <tr key={config.id}>
                <td className="border p-2">{config.name}</td>
                <td className="border p-2">{config.apiKey}</td>
                <td className="border p-2">{config.maxTokens}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Name"
            value={newLlmConfig.name}
            onChange={(e) => setNewLlmConfig({...newLlmConfig, name: e.target.value})}
            className="border p-1 mr-2"
          />
          <input
            type="text"
            placeholder="API Key"
            value={newLlmConfig.apiKey}
            onChange={(e) => setNewLlmConfig({...newLlmConfig, apiKey: e.target.value})}
            className="border p-1 mr-2"
          />
          <input
            type="number"
            placeholder="Max Tokens"
            value={newLlmConfig.maxTokens}
            onChange={(e) => setNewLlmConfig({...newLlmConfig, maxTokens: parseInt(e.target.value)})}
            className="border p-1 mr-2"
          />
          <button
            onClick={addLlmConfig}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add LLM Config
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Subcategories</h3>
        <ul className="list-disc list-inside">
          {subcategories.map((subcategory) => (
            <li key={subcategory.id}>{subcategory.name}</li>
          ))}
        </ul>
        <div className="mt-2">
          <input
            type="text"
            placeholder="New Subcategory"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="border p-1 mr-2"
          />
          <button
            onClick={addSubcategory}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Subcategory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

