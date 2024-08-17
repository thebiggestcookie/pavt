import React, { useState, useEffect } from 'react';
import { fetchAttributes, updateAttributes, fetchSubcategories, addSubcategory } from '../api/api';

const AttributeEditor = () => {
  const [attributes, setAttributes] = useState({});
  const [newAttribute, setNewAttribute] = useState({ name: '', values: '', subcategory: '' });
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState('');

  useEffect(() => {
    loadAttributes();
    loadSubcategories();
  }, []);

  const loadAttributes = async () => {
    try {
      const attributesData = await fetchAttributes();
      setAttributes(attributesData);
    } catch (error) {
      console.error('Error loading attributes:', error);
    }
  };

  const loadSubcategories = async () => {
    try {
      const subcategoriesData = await fetchSubcategories();
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute({ ...newAttribute, [name]: value });
  };

  const handleAddAttribute = async () => {
    if (newAttribute.name && newAttribute.values && newAttribute.subcategory) {
      const updatedAttributes = {
        ...attributes,
        [newAttribute.subcategory]: {
          ...attributes[newAttribute.subcategory],
          [newAttribute.name]: newAttribute.values.split(',').map(value => value.trim())
        }
      };
      try {
        await updateAttributes(updatedAttributes);
        setAttributes(updatedAttributes);
        setNewAttribute({ name: '', values: '', subcategory: '' });
      } catch (error) {
        console.error('Error adding attribute:', error);
      }
    }
  };

  const handleDeleteAttribute = async (subcategory, attributeName) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[subcategory][attributeName];
    try {
      await updateAttributes(updatedAttributes);
      setAttributes(updatedAttributes);
    } catch (error) {
      console.error('Error deleting attribute:', error);
    }
  };

  const handleAddSubcategory = async () => {
    if (newSubcategory) {
      try {
        const addedSubcategory = await addSubcategory({ name: newSubcategory, parentCategory: 'Coffee' });
        setSubcategories([...subcategories, addedSubcategory]);
        setNewSubcategory('');
      } catch (error) {
        console.error('Error adding subcategory:', error);
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Attribute Editor</h2>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Add New Subcategory</h3>
        <input
          type="text"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          placeholder="New Subcategory Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddSubcategory}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Subcategory
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Add New Attribute</h3>
        <select
          name="subcategory"
          value={newAttribute.subcategory}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map(subcategory => (
            <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
          ))}
        </select>
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
        {Object.entries(attributes).map(([subcategory, subcategoryAttributes]) => (
          <div key={subcategory} className="mb-4">
            <h4 className="font-bold">{subcategory}</h4>
            {Object.entries(subcategoryAttributes).map(([name, values]) => (
              <div key={name} className="ml-4 mb-2 p-2 border rounded">
                <h5 className="font-semibold">{name}</h5>
                <p className="mb-2">{values.join(', ')}</p>
                <button
                  onClick={() => handleDeleteAttribute(subcategory, name)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeEditor;

