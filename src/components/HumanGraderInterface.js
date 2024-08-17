import React, { useState, useEffect } from 'react';
import { fetchProducts, updateProduct, fetchAttributes, updateAttributes } from '../api/api';

const HumanGraderInterface = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [accuracy, setAccuracy] = useState({ accurate: 0, inaccurate: 0, missing: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
    loadAttributes();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await fetchProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
      setLoading(false);
    }
  };

  const loadAttributes = async () => {
    try {
      const attributesData = await fetchAttributes();
      setAttributes(attributesData);
    } catch (error) {
      console.error('Error loading attributes:', error);
      setError('Failed to load attributes. Please try again.');
    }
  };

  const handleAttributeChange = async (attributeName, newValue) => {
    const updatedProduct = {
      ...filteredProducts[currentProductIndex],
      attributes: {
        ...filteredProducts[currentProductIndex].attributes,
        [attributeName]: newValue
      }
    };

    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      const updatedProducts = [...products];
      const index = updatedProducts.findIndex(p => p.id === updatedProduct.id);
      updatedProducts[index] = updatedProduct;
      setProducts(updatedProducts);
      setFilteredProducts(prevFiltered => {
        const newFiltered = [...prevFiltered];
        newFiltered[currentProductIndex] = updatedProduct;
        return newFiltered;
      });

      // Update accuracy
      if (newValue !== filteredProducts[currentProductIndex].attributes[attributeName]) {
        setAccuracy(prev => ({ ...prev, inaccurate: prev.inaccurate + 1 }));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleSubcategoryChange = async (newSubcategory) => {
    const updatedProduct = {
      ...filteredProducts[currentProductIndex],
      subcategory: newSubcategory
    };

    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      const updatedProducts = [...products];
      const index = updatedProducts.findIndex(p => p.id === updatedProduct.id);
      updatedProducts[index] = updatedProduct;
      setProducts(updatedProducts);
      setFilteredProducts(prevFiltered => {
        const newFiltered = [...prevFiltered];
        newFiltered[currentProductIndex] = updatedProduct;
        return newFiltered;
      });

      // Update accuracy
      if (newSubcategory !== filteredProducts[currentProductIndex].subcategory) {
        setAccuracy(prev => ({ ...prev, inaccurate: prev.inaccurate + 1 }));
      }
    } catch (error) {
      console.error('Error updating product subcategory:', error);
      setError('Failed to update product subcategory. Please try again.');
    }
  };

  const moveToNextProduct = () => {
    if (currentProductIndex < filteredProducts.length - 1) {
      updateAccuracy();
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      updateAccuracy();
      alert('All products verified!');
    }
  };

  const moveToPreviousProduct = () => {
    if (currentProductIndex > 0) {
      updateAccuracy();
      setCurrentProductIndex(currentProductIndex - 1);
    }
  };

  const updateAccuracy = () => {
    const currentProduct = filteredProducts[currentProductIndex];
    const subcategoryAttributes = attributes[currentProduct.subcategory] || {};
    const totalAttributes = Object.keys(subcategoryAttributes).length;
    const presentAttributes = Object.keys(currentProduct.attributes).length;
    const missingAttributes = totalAttributes - presentAttributes;

    setAccuracy(prev => ({
      ...prev,
      accurate: prev.accurate + presentAttributes,
      missing: prev.missing + missingAttributes
    }));
  };

  const handleAddNewVariable = async (attributeName, newVariable) => {
    const updatedAttributes = {
      ...attributes,
      [filteredProducts[currentProductIndex].subcategory]: {
        ...attributes[filteredProducts[currentProductIndex].subcategory],
        [attributeName]: [...(attributes[filteredProducts[currentProductIndex].subcategory]?.[attributeName] || []), newVariable]
      }
    };

    try {
      await updateAttributes(updatedAttributes);
      setAttributes(updatedAttributes);
    } catch (error) {
      console.error('Error updating attributes:', error);
      setError('Failed to add new variable. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentProductIndex(0);
  };

  if (loading) {
    return <div className="mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="mt-8 text-red-500">{error}</div>;
  }

  if (filteredProducts.length === 0) {
    return <div className="mt-8">No products to review. Please upload data first.</div>;
  }

  const currentProduct = filteredProducts[currentProductIndex];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Human Grader Interface</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <h3 className="text-xl font-semibold mb-2">{currentProduct.name}</h3>
      
      <div className="mb-4">
        <label className="block mb-2">Subcategory</label>
        <select
          value={currentProduct.subcategory || ''}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Subcategory</option>
          {Object.keys(attributes).map(subcategory => (
            <option key={subcategory} value={subcategory}>{subcategory}</option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Attribute</th>
            <th className="border p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {currentProduct.subcategory && attributes[currentProduct.subcategory] &&
           Object.entries(attributes[currentProduct.subcategory]).map(([attrName, attrValues]) => (
            <tr key={attrName}>
              <td className="border p-2">{attrName}</td>
              <td className="border p-2">
                <select
                  value={currentProduct.attributes[attrName] || ''}
                  onChange={(e) => handleAttributeChange(attrName, e.target.value)}
                  className="w-full p-1"
                >
                  <option value="">Select {attrName}</option>
                  {attrValues.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const newVariable = prompt(`Enter new variable for ${attrName}`);
                    if (newVariable) handleAddNewVariable(attrName, newVariable);
                  }}
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={moveToPreviousProduct}
          disabled={currentProductIndex === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous Product
        </button>
        <button
          onClick={moveToNextProduct}
          disabled={currentProductIndex === filteredProducts.length - 1}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next Product
        </button>
      </div>
      <p className="mt-2">Verifying product {currentProductIndex + 1} of {filteredProducts.length}</p>
      <div className="mt-4">
        <h4 className="font-bold">Accuracy Metrics:</h4>
        <p>Accurate: {accuracy.accurate}</p>
        <p>Inaccurate: {accuracy.inaccurate}</p>
        <p>Missing: {accuracy.missing}</p>
      </div>
    </div>
  );
};

export default HumanGraderInterface;

