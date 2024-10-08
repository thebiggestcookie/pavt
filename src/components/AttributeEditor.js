import React, { useState, useEffect } from 'react';
import { fetchAttributes, updateAttribute, createAttribute, deleteAttribute, fetchCategories, fetchSubcategories } from '../utils/api';

const AttributeEditor = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [newAttribute, setNewAttribute] = useState({ name: '', type: 'select', values: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      loadAttributes(selectedCategory, selectedSubcategory);
    }
  }, [selectedCategory, selectedSubcategory]);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories: ' + (error.response?.data?.error || error.message));
    }
  };

  const loadSubcategories = async (category) => {
    try {
      const fetchedSubcategories = await fetchSubcategories();
      const filteredSubcategories = fetchedSubcategories.filter(sub => sub.category === category);
      setSubcategories(filteredSubcategories);
      setSelectedSubcategory('');
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setError('Failed to load subcategories: ' + (error.response?.data?.error || error.message));
    }
  };

  const loadAttributes = async (category, subcategory) => {
    try {
      const fetchedAttributes = await fetchAttributes();
      const filteredAttributes = fetchedAttributes.filter(attr => attr.category === category && attr.subcategory === subcategory);
      setAttributes(filteredAttributes);
    } catch (error) {
      console.error('Error loading attributes:', error);
      setError('Failed to load attributes: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory('');
    setAttributes([]);
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  const handleAttributeValuesChange = (index, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].values = value.split(',').map(v => v.trim());
    setAttributes(updatedAttributes);
  };

  const handleNewAttributeChange = (field, value) => {
    setNewAttribute({ ...newAttribute, [field]: value });
  };

  const handleNewAttributeValuesChange = (value) => {
    setNewAttribute({ ...newAttribute, values: value.split(',').map(v => v.trim()) });
  };

  const handleSaveAttribute = async (attribute) => {
    try {
      if (attribute.id) {
        await updateAttribute(attribute.id, attribute);
      } else {
        await createAttribute({ ...attribute, category: selectedCategory, subcategory: selectedSubcategory });
      }
      loadAttributes(selectedCategory, selectedSubcategory);
      setError('');
    } catch (error) {
      console.error('Error saving attribute:', error);
      setError('Failed to save attribute: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteAttribute = async (id) => {
    try {
      await deleteAttribute(id);
      loadAttributes(selectedCategory, selectedSubcategory);
      setError('');
    } catch (error) {
      console.error('Error deleting attribute:', error);
      setError('Failed to delete attribute: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddNewAttribute = async () => {
    try {
      await createAttribute({ ...newAttribute, category: selectedCategory, subcategory: selectedSubcategory });
      loadAttributes(selectedCategory, selectedSubcategory);
      setNewAttribute({ name: '', type: 'select', values: [] });
      setError('');
    } catch (error) {
      console.error('Error adding new attribute:', error);
      setError('Failed to add new attribute: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Attribute Editor</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Subcategory</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            disabled={!selectedCategory}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.name}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedCategory && selectedSubcategory && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Attributes</h2>
          {attributes.map((attribute, index) => (
            <div key={attribute.id} className="mb-4 p-4 border rounded">
              <input
                type="text"
                value={attribute.name}
                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Attribute Name"
              />
              <select
                value={attribute.type}
                onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="select">Select</option>
                <option value="multiselect">Multiselect</option>
                <option value="boolean">Boolean</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
              {['select', 'multiselect'].includes(attribute.type) && (
                <input
                  type="text"
                  value={attribute.values.join(', ')}
                  onChange={(e) => handleAttributeValuesChange(index, e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Comma-separated values"
                />
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveAttribute(attribute)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDeleteAttribute(attribute.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <h3 className="text-xl font-bold mb-2">Add New Attribute</h3>
          <div className="mb-4 p-4 border rounded">
            <input
              type="text"
              value={newAttribute.name}
              onChange={(e) => handleNewAttributeChange('name', e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="New Attribute Name"
            />
            <select
              value={newAttribute.type}
              onChange={(e) => handleNewAttributeChange('type', e.target.value)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="select">Select</option>
              <option value="multiselect">Multiselect</option>
              <option value="boolean">Boolean</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            {['select', 'multiselect'].includes(newAttribute.type) && (
              <input
                type="text"
                value={newAttribute.values.join(', ')}
                onChange={(e) => handleNewAttributeValuesChange(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Comma-separated values"
              />
            )}
            <button
              onClick={handleAddNewAttribute}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Attribute
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AttributeEditor;