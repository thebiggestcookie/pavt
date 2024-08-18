import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '' });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrompt(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/prompts', newPrompt);
      setNewPrompt({ name: '', content: '' });
      fetchPrompts();
    } catch (error) {
      console.error('Error creating prompt:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/prompts/${id}`);
      fetchPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Prompt Management</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Prompt Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newPrompt.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            Prompt Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={newPrompt.content}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Prompt
        </button>
      </form>
      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Prompts</h2>
        {prompts.map(prompt => (
          <div key={prompt.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-lg font-semibold">{prompt.name}</h3>
            <p className="text-gray-700 mb-2">{prompt.content}</p>
            <button
              onClick={() => handleDelete(prompt.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
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
