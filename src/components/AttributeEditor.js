import React, { useState, useEffect } from 'react';
import { fetchAttributes, updateAttributes, fetchSubcategories } from '../utils/api';

const AttributeEditor = () => {
  const [categories, setCategories] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedCategories, fetchedSubcategories] = await Promise.all([
        fetchAttributes(),
        fetchSubcategories()
      ]);
      setCategories(fetchedCategories);
      setSubcategories(fetchedSubcategories);
      setError('');
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeChange = (category, subcategory, attribute, value) => {
    setCategories(prevCategories => ({
      ...prevCategories,
      [category]: {
        ...prevCategories[category],
        [subcategory]: {
          ...prevCategories[category]?.[subcategory],
          [attribute]: value.split(',').map(item => item.trim())
        }
      }
    }));
  };

  const handleSaveAttributes = async () => {
    try {
      setLoading(true);
      await updateAttributes(categories);
      setError('');
      alert('Attributes saved successfully!');
    } catch (err) {
      setError('Failed to save attributes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category name:');
    if (newCategory) {
      setCategories(prevCategories => ({
        ...prevCategories,
        [newCategory]: {}
      }));
    }
  };

  const handleAddSubcategory = (category) => {
    const newSubcategory = prompt('Enter new subcategory name:');
    if (newSubcategory) {
      setCategories(prevCategories => ({
        ...prevCategories,
        [category]: {
          ...prevCategories[category],
          [newSubcategory]: {}
        }
      }));
    }
  };

  const handleAddAttribute = (category, subcategory) => {
    const newAttribute = prompt('Enter new attribute name:');
    if (newAttribute) {
      setCategories(prevCategories => ({
        ...prevCategories,
        [category]: {
          ...prevCategories[category],
          [subcategory]: {
            ...prevCategories[category][subcategory],
            [newAttribute]: []
          }
        }
      }));
    }
  };

  if (loading) {
    return <div>Loading attributes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Attribute Editor</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <button
        onClick={handleAddCategory}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add Category
      </button>

      {Object.entries(categories).map(([category, subcategories]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{category}</h2>
          <button
            onClick={() => handleAddSubcategory(category)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mb-2"
          >
            Add Subcategory
          </button>
          {Object.entries(subcategories).map(([subcategory, attributes]) => (
            <div key={subcategory} className="ml-4 mb-4">
              <h3 className="text-xl font-semibold mb-2">{subcategory}</h3>
              <button
                onClick={() => handleAddAttribute(category, subcategory)}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded mb-2"
              >
                Add Attribute
              </button>
              {Object.entries(attributes).map(([attribute, values]) => (
                <div key={attribute} className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">{attribute}</label>
                  <input
                    type="text"
                    value={Array.isArray(values) ? values.join(', ') : ''}
                    onChange={(e) => handleAttributeChange(category, subcategory, attribute, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      
      <button
        onClick={handleSaveAttributes}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Attributes'}
      </button>
    </div>
  );
};

export default AttributeEditor;

