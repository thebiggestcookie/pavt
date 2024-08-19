import React, { useState, useEffect } from 'react';
import { fetchPrompts, updatePrompt } from '../utils/api';

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      const fetchedPrompts = await fetchPrompts();
      setPrompts(fetchedPrompts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load prompts: ' + err.message);
      setLoading(false);
    }
  };

  const handlePromptChange = (id, content) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === id ? { ...prompt, content } : prompt
    ));
  };

  const handleSavePrompt = async (id) => {
    try {
      const promptToUpdate = prompts.find(prompt => prompt.id === id);
      await updatePrompt(id, promptToUpdate);
      alert('Prompt updated successfully');
    } catch (err) {
      setError('Failed to update prompt: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Prompt Management</h1>
      {prompts.map(prompt => (
        <div key={prompt.id} className="mb-4">
          <h2 className="text-xl font-bold">{prompt.name}</h2>
          <textarea
            value={prompt.content}
            onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
            className="w-full h-32 p-2 border rounded"
          />
          <button
            onClick={() => handleSavePrompt(prompt.id)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
};

export default PromptManagement;

