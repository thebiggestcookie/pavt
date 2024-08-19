import React, { useState, useEffect } from 'react';
import { fetchPrompts, createPrompt, updatePrompt, deletePrompt } from '../utils/api';

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '', step: 1 });
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const fetchedPrompts = await fetchPrompts();
      setPrompts(fetchedPrompts);
    } catch (err) {
      setError('Failed to load prompts');
    }
  };

  const handleCreatePrompt = async () => {
    try {
      await createPrompt(newPrompt);
      setNewPrompt({ name: '', content: '', step: 1 });
      loadPrompts();
    } catch (err) {
      setError('Failed to create prompt');
    }
  };

  const handleUpdatePrompt = async (id, updatedPrompt) => {
    try {
      await updatePrompt(id, updatedPrompt);
      loadPrompts();
    } catch (err) {
      setError('Failed to update prompt');
    }
  };

  const handleDeletePrompt = async (id) => {
    try {
      await deletePrompt(id);
      loadPrompts();
    } catch (err) {
      setError('Failed to delete prompt');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Prompt Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create New Prompt</h2>
        <input
          type="text"
          placeholder="Prompt Name"
          value={newPrompt.name}
          onChange={(e) => setNewPrompt({...newPrompt, name: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Prompt Content"
          value={newPrompt.content}
          onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
          rows="4"
        />
        <input
          type="number"
          placeholder="Step"
          value={newPrompt.step}
          onChange={(e) => setNewPrompt({...newPrompt, step: parseInt(e.target.value)})}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreatePrompt}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Prompt
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Existing Prompts</h2>
        {prompts.map((prompt) => (
          <div key={prompt.id} className="mb-4 p-4 border rounded">
            <h3 className="text-xl font-bold">{prompt.name}</h3>
            <p className="mb-2">Step: {prompt.step}</p>
            <textarea
              value={prompt.content}
              onChange={(e) => handleUpdatePrompt(prompt.id, {...prompt, content: e.target.value})}
              className="w-full p-2 mb-2 border rounded"
              rows="4"
            />
            <button
              onClick={() => handleDeletePrompt(prompt.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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

