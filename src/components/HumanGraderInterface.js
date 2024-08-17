import React, { useState, useEffect } from 'react';
import { fetchProducts, updateProduct, fetchAttributes, updateAttributes } from '../api/api';

const HumanGraderInterface = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    loadProducts();
    loadAttributes();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadAttributes = async () => {
    try {
      const attributesData = await fetchAttributes();
      setAttributes(attributesData);
    } catch (error) {
      console.error('Error loading attributes:', error);
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
    } catch (error) {
      console.error('Error updating product:', error);
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
    } catch (error) {
      console.error('Error updating product subcategory:', error);
    }
  };

  const moveToNextProduct = () => {
    if (currentProductIndex < filteredProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      alert('All products verified!');
    }
  };

  const moveToPreviousProduct = () => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1);
    }
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
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentProductIndex(0);
  };

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
          disabled={!editMode}
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
                  disabled={!editMode}
                >
                  <option value="">Select {attrName}</option>
                  {attrValues.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {editMode && (
                  <button
                    onClick={() => {
                      const newVariable = prompt(`Enter new variable for ${attrName}`);
                      if (newVariable) handleAddNewVariable(attrName, newVariable);
                    }}
                    className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    +
                  </button>
                )}
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
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded ${editMode ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}
        >
          {editMode ? 'Finish Editing' : 'Edit'}
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
    </div>
  );
};

export default HumanGraderInterface;