import React, { useState, useEffect } from 'react';
import { fetchAttributes, updateAttributes } from '../utils/api';

const AttributeEditor = () => {
  const [attributes, setAttributes] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setLoading(true);
      const fetchedAttributes = await fetchAttributes();
      setAttributes(fetchedAttributes);
      setError('');
    } catch (err) {
      setError('Failed to load attributes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeChange = (subcategory, attribute, value) => {
    setAttributes(prevAttributes => ({
      ...prevAttributes,
      [subcategory]: {
        ...prevAttributes[subcategory],
        [attribute]: value.split(',').map(item => item.trim())
      }
    }));
  };

  const handleSaveAttributes = async () => {
    try {
      setLoading(true);
      await updateAttributes(attributes);
      setError('');
      alert('Attributes saved successfully!');
    } catch (err) {
      setError('Failed to save attributes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading attributes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Attribute Editor</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {Object.entries(attributes).map(([subcategory, subcategoryAttributes]) => (
        <div key={subcategory} className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{subcategory}</h2>
          {Object.entries(subcategoryAttributes).map(([attribute, values]) => (
            <div key={attribute} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{attribute}</label>
              <input
                type="text"
                value={Array.isArray(values) ? values.join(', ') : ''}
                onChange={(e) => handleAttributeChange(subcategory, attribute, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
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

