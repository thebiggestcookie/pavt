import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HumanGraderInterface = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [humanAttributes, setHumanAttributes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({ accurate: 0, inaccurate: 0, missing: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
      setLoading(false);
    }
  };

  const handleAttributeChange = (attribute, value) => {
    setHumanAttributes(prev => ({ ...prev, [attribute]: value }));
  };

  const handleSubmit = async () => {
    try {
      const currentProduct = products[currentProductIndex];
      const updatedMetrics = { ...metrics };

      Object.keys(currentProduct.attributes).forEach(attr => {
        if (humanAttributes[attr] === undefined) {
          updatedMetrics.missing++;
        } else if (humanAttributes[attr] !== currentProduct.attributes[attr]) {
          updatedMetrics.inaccurate++;
        } else {
          updatedMetrics.accurate++;
        }
      });

      await axios.put(`/api/products/${currentProduct.id}`, {
        ...currentProduct,
        human_attributes: humanAttributes,
        human_verified: true
      });

      setMetrics(updatedMetrics);
      setCurrentProductIndex(prev => prev + 1);
      setHumanAttributes({});
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return <div>No products available for grading.</div>;
  }

  if (currentProductIndex >= products.length) {
    return <div>All products have been graded!</div>;
  }

  const currentProduct = products[currentProductIndex];

  // Dummy data for attribute options
  const attributeOptions = {
    'Roast Level': ['Light', 'Medium', 'Dark', 'French', 'Italian', 'City', 'Full City', 'Vienna'],
    'Origin': ['Ethiopia', 'Colombia', 'Brazil', 'Kenya', 'Indonesia', 'Guatemala', 'Costa Rica', 'Jamaica', 'Hawaii', 'Vietnam'],
    'Flavor Notes': ['Fruity', 'Nutty', 'Chocolatey', 'Floral', 'Spicy', 'Earthy', 'Citrusy', 'Caramel', 'Smoky', 'Berry', 'Vanilla', 'Honey'],
    'Grind Type': ['Whole Bean', 'Ground', 'Espresso', 'French Press', 'Drip', 'Turkish'],
    'Organic': ['Yes', 'No'],
    'Fair Trade': ['Yes', 'No'],
    'Processing Method': ['Washed', 'Natural', 'Honey', 'Wet-Hulled'],
    'Altitude': ['Low', 'Medium', 'High'],
    'Body': ['Light', 'Medium', 'Full'],
    'Acidity': ['Low', 'Medium', 'High'],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Human Grader Interface</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">{currentProduct.name}</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">LLM Generated Attributes:</h3>
          {Object.entries(currentProduct.attributes).map(([key, value]) => (
            <div key={key} className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                {key}:
              </label>
              <select
                id={key}
                value={humanAttributes[key] || value}
                onChange={(e) => handleAttributeChange(key, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value={value}>{value}</option>
                {attributeOptions[key] && attributeOptions[key].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              {humanAttributes[key] === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify other value"
                  className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => handleAttributeChange(key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Submit and Next
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Grading Metrics:</h3>
        <p>Accurate: {metrics.accurate}</p>
        <p>Inaccurate: {metrics.inaccurate}</p>
        <p>Missing: {metrics.missing}</p>
      </div>
    </div>
  );
};

export default HumanGraderInterface;