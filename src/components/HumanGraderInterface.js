import React, { useState, useEffect } from 'react';
import { updateProduct, fetchSubcategories, updateAttributes, fetchProducts, fetchAttributes } from '../api/api';

const HumanGraderInterface = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    loadSubcategories();
    loadProducts();
    loadAttributes();
  }, []);

  const loadSubcategories = async () => {
    try {
      const subcategoriesData = await fetchSubcategories();
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
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
    if (!products[currentProductIndex]) return;

    const updatedProduct = {
      ...products[currentProductIndex],
      attributes: {
        ...products[currentProductIndex].attributes,
        [attributeName]: newValue
      }
    };

    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      const updatedProducts = [...products];
      updatedProducts[currentProductIndex] = updatedProduct;
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleSubcategoryChange = async (newSubcategory) => {
    if (!products[currentProductIndex]) return;

    const updatedProduct = {
      ...products[currentProductIndex],
      subcategory: newSubcategory
    };

    try {
      await updateProduct(updatedProduct.id, updatedProduct);
      const updatedProducts = [...products];
      updatedProducts[currentProductIndex] = updatedProduct;
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product subcategory:', error);
    }
  };

  const moveToNextProduct = () => {
    if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      alert('All products verified!');
    }
  };

  const handleAddNewVariable = async (attributeName, newVariable) => {
    if (!products[currentProductIndex] || !products[currentProductIndex].subcategory) return;

    const updatedAttributes = {
      ...attributes,
      [products[currentProductIndex].subcategory]: {
        ...attributes[products[currentProductIndex].subcategory],
        [attributeName]: [...(attributes[products[currentProductIndex].subcategory]?.[attributeName] || []), newVariable]
      }
    };

    try {
      await updateAttributes(updatedAttributes);
      setAttributes(updatedAttributes);
    } catch (error) {
      console.error('Error updating attributes:', error);
    }
  };

  if (products.length === 0) {
    return <div className="mt-8">No products to review. Please upload data first.</div>;
  }

  const currentProduct = products[currentProductIndex];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Human Grader Interface</h2>
      <h3 className="text-xl font-semibold mb-2">{currentProduct.name}</h3>
      
      <div className="mb-4">
        <label className="block mb-2">Subcategory</label>
        <select
          value={currentProduct.subcategory || ''}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map(subcategory => (
            <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
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
      <button
        onClick={moveToNextProduct}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Next Product
      </button>
      <p className="mt-2">Verifying product {currentProductIndex + 1} of {products.length}</p>
    </div>
  );
};

export default HumanGraderInterface;

