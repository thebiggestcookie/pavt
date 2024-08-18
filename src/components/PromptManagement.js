import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '', step: 1 });
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrompts();
    fetchSubcategories();
    fetchAttributes();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/prompts');
      setPrompts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setError('Failed to fetch prompts. Please try again.');
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to fetch subcategories. Please try again.');
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await axios.get('/api/attributes');
      setAttributes(response.data);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      setError('Failed to fetch attributes. Please try again.');
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
      setNewPrompt({ name: '', content: '', step: 1 });
      fetchPrompts();
    } catch (error) {
      console.error('Error creating prompt:', error);
      setError('Failed to create prompt. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/prompts/${id}`);
      fetchPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setError('Failed to delete prompt. Please try again.');
    }
  };

  const generatePromptContent = () => {
    if (newPrompt.step === 1) {
      return `You are an AI assistant tasked with categorizing products. Given a product name, your job is to identify the most appropriate subcategory for the product from the following list:

${subcategories.map(sub => `- ${sub.name}`).join('\n')}

Please respond with only the subcategory name, nothing else.

Product Name: [Product Name Here]`;
    } else {
      return `You are an AI assistant tasked with generating product attributes. Given a product name and its subcategory, your job is to generate appropriate values for the following attributes:

${attributes.map(attr => `- ${attr.name} (${attr.type})`).join('\n')}

Please respond in valid JSON format, with the attribute names as keys and the generated values as their corresponding values. Ensure that the values match the specified type for each attribute.

Product Name: [Product Name Here]
Subcategory: [Subcategory Here]`;
    }
  };

  if (loading) {
    return <div>Loading prompts...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
          <label htmlFor="step" className="block text-gray-700 text-sm font-bold mb-2">
            Step:
          </label>
          <select
            id="step"
            name="step"
            value={newPrompt.step}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value={1}>Step 1 - Subcategory Identification</option>
            <option value={2}>Step 2 - Attribute Generation</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            Prompt Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={newPrompt.content || generatePromptContent()}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="10"
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
            <h3 className="text-lg font-semibold">{prompt.name} (Step {prompt.step})</h3>
            <pre className="text-gray-700 mb-2 whitespace-pre-wrap">{prompt.content}</pre>
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
