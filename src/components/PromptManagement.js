import React, { useState, useEffect } from 'react';
import { fetchPrompts, addPrompt, updatePrompt, deletePrompt } from '../api/api';

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '', model: 'gpt-4' });

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const promptsData = await fetchPrompts();
      setPrompts(promptsData);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrompt({ ...newPrompt, [name]: value });
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

