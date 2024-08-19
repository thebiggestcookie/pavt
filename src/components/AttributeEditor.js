import React, { useState, useEffect } from 'react';
import { fetchAttributes, updateAttributes } from '../utils/api';

const AttributeEditor = () => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      const fetchedAttributes = await fetchAttributes();
      setCategories(fetchedAttributes);
    } catch (error) {
      setError('Failed to load attributes: ' + error.message);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubCategory('');
    setSelectedSubSubCategory('');
    setAttributes([]);
  };

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategory(event.target.value);
    setSelectedSubSubCategory('');
    setAttributes([]);
  };

  const handleSubSubCategoryChange = (event) => {
    setSelectedSubSubCategory(event.target.value);
    setAttributes(categories[selectedCategory][selectedSubCategory][event.target.value] || []);
  };

  const handleAddAttribute = () => {
    if (newAttribute && !attributes.includes(newAttribute)) {
      setAttributes([...attributes, newAttribute]);
      setNewAttribute('');
    }
  };

  const handleRemoveAttribute = (attr) => {
    setAttributes(attributes.filter((a) => a !== attr));
  };

  const handleSave = async () => {
    try {
      const updatedCategories = {
        ...categories,
        [selectedCategory]: {
          ...categories[selectedCategory],
          [selectedSubCategory]: {
            ...categories[selectedCategory][selectedSubCategory],
            [selectedSubSubCategory]: attributes
          }
        }
      };
      await updateAttributes(updatedCategories);
      setCategories(updatedCategories);
      setError('');
    } catch (error) {
      setError('Failed to save attributes: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Attribute Editor</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Main Category</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select Main Category</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <div>
            <label className="block mb-2">Sub Category</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
            >
              <option value="">Select Sub Category</option>
              {Object.keys(categories[selectedCategory] || {}).map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedSubCategory && (
          <div>
            <label className="block mb-2">Sub-Sub Category</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubSubCategory}
              onChange={handleSubSubCategoryChange}
            >
              <option value="">Select Sub-Sub Category</option>
              {Object.keys(categories[selectedCategory][selectedSubCategory] || {}).map((subSubCategory) => (
                <option key={subSubCategory} value={subSubCategory}>
                  {subSubCategory}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {selectedSubSubCategory && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Attributes</h2>
          <ul className="mb-4">
            {attributes.map((attr) => (
              <li key={attr} className="flex items-center mb-2">
                <span className="mr-2">{attr}</span>
                <button
                  onClick={() => handleRemoveAttribute(attr)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex mb-4">
            <input
              type="text"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
              className="flex-grow p-2 border rounded-l"
              placeholder="New attribute"
            />
            <button
              onClick={handleAddAttribute}
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
            >
              Add
            </button>
          </div>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AttributeEditor;

