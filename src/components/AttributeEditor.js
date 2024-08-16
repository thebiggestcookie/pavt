import React, { useState, useEffect } from 'react';
import { fetchAttributes, updateAttributes } from '../api/api';

const AttributeEditor = () => {
  const [attributes, setAttributes] = useState({});
  const [newAttribute, setNewAttribute] = useState({ name: '', values: '' });

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const attributesData = await fetchAttributes();
      setAttributes(attributesData);
    } catch (error) {
      console.error('Error loading attributes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute({ ...newAttribute, [name]: value });
  };

  const handleAddAttribute = async () => {
    if (newAttribute.name && newAttribute.values) {
      const updatedAttributes = {
        ...attributes,
        [newAttribute.name]: newAttribute.values.split(',').map(value => value.trim())
      };
      try {
        await updateAttributes(updatedAttributes);
        setAttributes(updatedAttributes);
        setNewAttribute({ name: '', values: '' });
      } catch (error) {
        console.error('Error adding attribute:', error);
      }
    }
  };

  const handleDeleteAttribute = async (attributeName) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[attributeName];
    try {
      await updateAttributes(updatedAttributes);
      setAttributes(updatedAttributes);
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Attribute Editor</h2>
      
      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={newAttribute.name}
          onChange={handleInputChange}
          placeholder="Attribute Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          name="values"
          value={newAttribute.values}
          onChange={handleInputChange}
          placeholder="Attribute Values (comma-separated)"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddAttribute}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Attribute
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Attributes</h3>
        {Object.entries(attributes).map(([name, values]) => (
          <div key={name} className="mb-4 p-4 border rounded">
            <h4 className="font-bold">{name}</h4>
            <p className="mb-2">{values.join(', ')}</p>
            <button
              onClick={() => handleDeleteAttribute(name)}
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

export default AttributeEditor;

