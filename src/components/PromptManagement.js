import React, { useState } from 'react';

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([
    { id: 1, name: 'Coffee Origin', content: 'Identify the origin of the coffee based on the product description.' },
    { id: 2, name: 'Roast Level', content: 'Determine the roast level (Light, Medium, or Dark) based on the product name and description.' },
  ]);

  const [newPrompt, setNewPrompt] = useState({ name: '', content: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrompt({ ...newPrompt, [name]: value });
  };

  const addPrompt = () => {
    if (newPrompt.name && newPrompt.content) {
      setPrompts([...prompts, { id: prompts.length + 1, ...newPrompt }]);
      setNewPrompt({ name: '', content: '' });
    }
  };

  const editPrompt = (id) => {
    const promptToEdit = prompts.find(prompt => prompt.id === id);
    if (promptToEdit) {
      setNewPrompt({ ...promptToEdit });
      setPrompts(prompts.filter(prompt => prompt.id !== id));
    }
  };

  const deletePrompt = (id) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
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
        <button
          onClick={addPrompt}
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
            <button
              onClick={() => editPrompt(prompt.id)}
              className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => deletePrompt(prompt.id)}
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

