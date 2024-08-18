import React, { useState, useEffect } from 'react';
import { fetchProducts, updateProduct, fetchAttributes, updateAttributes, processWithLLM, fetchLlmConfigs, fetchPrompts } from '../api/api';

const HumanGraderInterface = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [accuracy, setAccuracy] = useState({ accurate: 0, inaccurate: 0, missing: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [currentProductChanges, setCurrentProductChanges] = useState({});

  useEffect(() => {
    loadProducts();
    loadAttributes();
    loadLlmConfigs();
    loadPrompts();
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

  const loadLlmConfigs = async () => {
    try {
      const configs = await fetchLlmConfigs();
      setLlmConfigs(configs);
    } catch (error) {
      console.error('Error loading LLM configs:', error);
      setError('Failed to load LLM configurations. Please try again.');
    }
  };

  const loadPrompts = async () => {
    try {
      const promptsData = await fetchPrompts();
      setPrompts(promptsData);
    } catch (error) {
      console.error('Error loading prompts:', error);
      setError('Failed to load prompts. Please try again.');
    }
  };

  const handleAttributeChange = (attributeName, newValue) => {
    setCurrentProductChanges(prev => ({
      ...prev,
      [attributeName]: newValue
    }));
  };

  const handleSubcategoryChange = (newSubcategory) => {
    setCurrentProductChanges(prev => ({
      ...prev,
      subcategory: newSubcategory
    }));
  };

  const submitChanges = async () => {
    const updatedProduct = {
      ...filteredProducts[currentProductIndex],
      ...currentProductChanges,
      attributes: {
        ...filteredProducts[currentProductIndex].attributes,
        ...currentProductChanges
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
      updateAccuracy(updatedProduct);

      // Clear current changes
      setCurrentProductChanges({});
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  const moveToNextProduct = () => {
    if (currentProductIndex < filteredProducts.length - 1) {
      submitChanges();
      setCurrentProductIndex(currentProductIndex + 1);
      setCurrentProductChanges({});
    } else {
      submitChanges();
      alert('All products verified!');
    }
  };

  const moveToPreviousProduct = () => {
    if (currentProductIndex > 0) {
      submitChanges();
      setCurrentProductIndex(currentProductIndex - 1);
      setCurrentProductChanges({});
    }
  };

  const updateAccuracy = (updatedProduct) => {
    const subcategoryAttributes = attributes[updatedProduct.subcategory] || {};
    const totalAttributes = Object.keys(subcategoryAttributes).length;
    let accurate = 0;
    let inaccurate = 0;
    let missing = 0;

    Object.keys(subcategoryAttributes).forEach(attr => {
      if (updatedProduct.attributes[attr] === updatedProduct.humanAttributes[attr]) {
        accurate++;
      } else if (updatedProduct.attributes[attr] && updatedProduct.attributes[attr] !== updatedProduct.humanAttributes[attr]) {
        inaccurate++;
      } else {
        missing++;
      }
    });

    setAccuracy(prev => ({
      accurate: prev.accurate + accurate,
      inaccurate: prev.inaccurate + inaccurate,
      missing: prev.missing + missing
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

  const handlePromptChange = (e) => {
    setSelectedPrompt(prompts.find(prompt => prompt.id === e.target.value));
  };

  const regenerateAttributes = async () => {
    if (!selectedPrompt) {
      setError('Please select a prompt first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedProducts = await Promise.all(products.map(async (product) => {
        const [result1, result2] = await Promise.all([
          processWithLLM(selectedPrompt.content, product.name, llmConfigs[0]),
          processWithLLM(selectedPrompt.content, product.name, llmConfigs[1])
        ]);

        if (JSON.stringify(result1.attributes) === JSON.stringify(result2.attributes)) {
          return { ...product, attributes: result1.attributes, needsReview: false };
        } else {
          return { ...product, attributes: result1.attributes, needsReview: true };
        }
      }));

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setCurrentProductIndex(0);
      setLoading(false);

      // Calculate accuracy based on human-generated answers
      const accuracy = calculateAccuracy(updatedProducts);
      setAccuracy(accuracy);

    } catch (error) {
      console.error('Error regenerating attributes:', error);
      setError('Failed to regenerate attributes. Please try again.');
      setLoading(false);
    }
  };

  const calculateAccuracy = (updatedProducts) => {
    let accurate = 0;
    let inaccurate = 0;
    let missing = 0;

    updatedProducts.forEach(product => {
      if (product.humanVerified) {
        Object.keys(attributes[product.subcategory] || {}).forEach(attr => {
          if (product.attributes[attr] === product.humanAttributes[attr]) {
            accurate++;
          } else if (product.attributes[attr] && product.attributes[attr] !== product.humanAttributes[attr]) {
            inaccurate++;
          } else {
            missing++;
          }
        });
      }
    });

    return { accurate, inaccurate, missing };
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

      <div className="mb-4">
        <label className="block mb-2">Select Prompt</label>
        <select
          value={selectedPrompt ? selectedPrompt.id : ''}
          onChange={handlePromptChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a prompt</option>
          {prompts.map(prompt => (
            <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={regenerateAttributes}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={!selectedPrompt}
      >
        Regenerate Attributes
      </button>

      <h3 className="text-xl font-semibold mb-2">{currentProduct.name}</h3>
      
      <div className="mb-4">
        <label className="block mb-2">Subcategory</label>
        <select
          value={currentProductChanges.subcategory || currentProduct.subcategory || ''}
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
                  value={currentProductChanges[attrName] || currentProduct.attributes[attrName] || ''}
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
          onClick={submitChanges}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit Changes
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