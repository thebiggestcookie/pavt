import React, { useState, useEffect, useCallback } from 'react';
import { fetchCategories, fetchSubcategories, fetchAttributes, createAttribute, updateAttribute, deleteAttribute } from '../utils/api';
import { debounce } from 'lodash';

const AttributeEditorV2 = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      setError('Failed to load categories: ' + error.message);
    }
  };

  const loadSubcategories = async (category) => {
    try {
      const fetchedSubcategories = await fetchSubcategories(category);
      setSubcategories(fetchedSubcategories);
    } catch (error) {
      setError('Failed to load subcategories: ' + error.message);
    }
  };

  const loadAttributes = async (reset = false) => {
    if (reset) {
      setAttributes([]);
      setPage(1);
      setHasMore(true);
    }

    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const fetchedAttributes = await fetchAttributes(selectedCategory, selectedSubcategory, searchTerm, page);
      setAttributes(prev => [...prev, ...fetchedAttributes]);
      setHasMore(fetchedAttributes.length > 0);
      setPage(prev => prev + 1);
    } catch (error) {
      setError('Failed to load attributes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory);
      setSelectedSubcategory('');
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      loadAttributes(true);
    }
  }, [selectedCategory, selectedSubcategory, searchTerm]);

  const debouncedSearch = useCallback(
    debounce((term) => setSearchTerm(term), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleAttributeChange = async (attribute, field, value) => {
    const updatedAttribute = { ...attribute, [field]: value };
    try {
      await updateAttribute(attribute.id, updatedAttribute);
      setAttributes(attributes.map(a => a.id === attribute.id ? updatedAttribute : a));
    } catch (error) {
      setError('Failed to update attribute: ' + error.message);
    }
  };

  const handleAddAttribute = async () => {
    const newAttribute = {
      name: 'New Attribute',
      type: 'text',
      values: [],
      category: selectedCategory,
      subcategory: selectedSubcategory
    };
    try {
      const createdAttribute = await createAttribute(newAttribute);
      setAttributes([createdAttribute, ...attributes]);
    } catch (error) {
      setError('Failed to add attribute: ' + error.message);
    }
  };

  const handleDeleteAttribute = async (id) => {
    try {
      await deleteAttribute(id);
      setAttributes(attributes.filter(a => a.id !== id));
    } catch (error) {
      setError('Failed to delete attribute: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Attribute Editor V2</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <select
          className="p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          disabled={!selectedCategory}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search attributes"
          className="p-2 border rounded"
          onChange={handleSearchChange}
        />
      </div>
      {selectedCategory && selectedSubcategory && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleAddAttribute}
        >
          Add New Attribute
        </button>
      )}
      <div className="space-y-4">
        {attributes.map((attribute) => (
          <div key={attribute.id} className="border p-4 rounded">
            <input
              type="text"
              value={attribute.name}
              onChange={(e) => handleAttributeChange(attribute, 'name', e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            />
            <select
              value={attribute.type}
              onChange={(e) => handleAttributeChange(attribute, 'type', e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="multiselect">Multi-select</option>
              <option value="boolean">Boolean</option>
            </select>
            {['select', 'multiselect'].includes(attribute.type) && (
              <input
                type="text"
                value={attribute.values.join(', ')}
                onChange={(e) => handleAttributeChange(attribute, 'values', e.target.value.split(', '))}
                className="p-2 border rounded mb-2 w-full"
                placeholder="Enter values separated by commas"
              />
            )}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDeleteAttribute(attribute.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => loadAttributes()}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AttributeEditorV2;

