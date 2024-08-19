import React, { useState, useEffect } from 'react';
import { fetchLLMConfigs, createLLMConfig, updateLLMConfig, deleteLLMConfig } from '../utils/api';

const LLMConfigurator = () => {
  const [configs, setConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({ name: '', provider: '', model: '', apiKey: '', maxTokens: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const fetchedConfigs = await fetchLLMConfigs();
      setConfigs(fetchedConfigs);
      setLoading(false);
    } catch (err) {
      setError('Failed to load LLM configs: ' + err.message);
      setLoading(false);
    }
  };

  const handleCreateConfig = async () => {
    try {
      await createLLMConfig(newConfig);
      setNewConfig({ name: '', provider: '', model: '', apiKey: '', maxTokens: '' });
      loadConfigs();
    } catch (err) {
      setError('Failed to create LLM config: ' + err.message);
    }
  };

  const handleUpdateConfig = async (id, updatedConfig) => {
    try {
      await updateLLMConfig(id, updatedConfig);
      loadConfigs();
    } catch (err) {
      setError('Failed to update LLM config: ' + err.message);
    }
  };

  const handleDeleteConfig = async (id) => {
    try {
      await deleteLLMConfig(id);
      loadConfigs();
    } catch (err) {
      setError('Failed to delete LLM config: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>LLM Configurator</h1>
      <h2>Create New Config</h2>
      <input
        type="text"
        placeholder="Name"
        value={newConfig.name}
        onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Provider"
        value={newConfig.provider}
        onChange={(e) => setNewConfig({ ...newConfig, provider: e.target.value })}
      />
      <input
        type="text"
        placeholder="Model"
        value={newConfig.model}
        onChange={(e) => setNewConfig({ ...newConfig, model: e.target.value })}
      />
      <input
        type="text"
        placeholder="API Key"
        value={newConfig.apiKey}
        onChange={(e) => setNewConfig({ ...newConfig, apiKey: e.target.value })}
      />
      <input
        type="number"
        placeholder="Max Tokens"
        value={newConfig.maxTokens}
        onChange={(e) => setNewConfig({ ...newConfig, maxTokens: e.target.value })}
      />
      <button onClick={handleCreateConfig}>Create Config</button>
      <h2>Existing Configs</h2>
      {configs.map((config) => (
        <div key={config.id}>
          <h3>{config.name}</h3>
          <p>Provider: {config.provider}</p>
          <p>Model: {config.model}</p>
          <p>API Key: {config.apiKey}</p>
          <p>Max Tokens: {config.maxTokens}</p>
          <button onClick={() => handleUpdateConfig(config.id, { ...config, name: config.name + ' (updated)' })}>
            Update
          </button>
          <button onClick={() => handleDeleteConfig(config.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default LLMConfigurator;