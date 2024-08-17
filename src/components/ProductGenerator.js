import React, { useState, useEffect } from 'react';
import { fetchLlmConfigs, processWithLLM, addProduct, fetchSubcategories, fetchAttributes } from '../api/api';

const ProductGenerator = () => {
  const [category, setCategory] = useState('');
  const [productCount, setProductCount] = useState(5);
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [selectedLlmConfig, setSelectedLlmConfig] = useState('');
  const [generatedProducts, setGeneratedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [debugInfo, setDebugInfo] = useState([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    loadLlmConfigs();
    loadSubcategories();
    loadAttributes();
  }, []);

  const loadLlmConfigs = async () => {
    try {
      const configs = await fetchLlmConfigs();
      setLlmConfigs(configs);
      if (configs.length > 0) {
        setSelectedLlmConfig(configs[0].id);
      }
    } catch (error) {
      console.error('Error loading LLM configs:', error);
      setError('Failed to load LLM configurations');
    }
  };

  const loadSubcategories = async () => {
    try {
      const subcategoriesData = await fetchSubcategories();
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setError('Failed to load subcategories');
    }
  };

  const loadAttributes = async () => {
    try {
      const attributesData = await fetchAttributes();
      setAttributes(attributesData);
    } catch (error) {
      console.error('Error loading attributes:', error);
      setError('Failed to load attributes');
    }
  };

  const addDebugInfo = (info) => {
    setDebugInfo(prevInfo => [...prevInfo, info]);
  };

  const handleGenerateProducts = async () => {
    setLoading(true);
    setError(null);
    setGeneratedProducts([]);
    setDebugInfo([]);

    const selectedLlmConfigData = llmConfigs.find(c => c.id === selectedLlmConfig);

    try {
      // Generate product list
      const productListPrompt = `Generate a list of ${productCount} unique product names for the ${category} category. Return the result as a JSON array of strings. Ensure the response is a valid JSON array.`;
      const productListResult = await processWithLLM(productListPrompt, '', selectedLlmConfigData);
      addDebugInfo({ step: 'Product List Generation', prompt: productListPrompt, result: productListResult });

      let productList;
      try {
        productList = JSON.parse(productListResult.attributes);
        if (!Array.isArray(productList)) {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.error('Error parsing product list:', productListResult.attributes);
        productList = productListResult.attributes;
        if (typeof productList === 'string') {
          productList = productList.split('\n').filter(item => item.trim() !== '');
        } else if (!Array.isArray(productList)) {
          throw new Error('Unable to parse product list');
        }
      }

      // Generate subcategory and attributes for each product
      const generatedProductsWithAttributes = [];
      for (const productName of productList) {
        // Determine subcategory
        const subcategoryPrompt = `Determine the subcategory for the product "${productName}" in the ${category} category. Choose from the following options: ${subcategories.map(s => s.name).join(', ')}. Return the result as a JSON object with a single key "subcategory".`;
        const subcategoryResult = await processWithLLM(subcategoryPrompt, '', selectedLlmConfigData);
        addDebugInfo({ step: 'Subcategory Determination', prompt: subcategoryPrompt, result: subcategoryResult });

        let subcategory;
        try {
          subcategory = JSON.parse(subcategoryResult.attributes).subcategory;
        } catch (parseError) {
          console.error('Error parsing subcategory:', subcategoryResult.attributes);
          subcategory = 'Unknown';
        }

        // Generate attributes
        const attributePrompt = `Generate realistic attributes for the product "${productName}" in the ${subcategory} subcategory. Use the following attribute structure:
        ${JSON.stringify(attributes[subcategory], null, 2)}
        Return the result as a JSON object with key-value pairs representing the attributes and their values. Ensure the response is a valid JSON object.`;
        const attributeResult = await processWithLLM(attributePrompt, '', selectedLlmConfigData);
        addDebugInfo({ step: 'Attribute Generation', prompt: attributePrompt, result: attributeResult });

        let productAttributes;
        try {
          productAttributes = attributeResult.attributes;
          if (typeof productAttributes === 'string') {
            productAttributes = JSON.parse(productAttributes);
          }
          if (typeof productAttributes !== 'object' || productAttributes === null) {
            throw new Error('Response is not an object');
          }
        } catch (parseError) {
          console.error('Error parsing attributes:', attributeResult.attributes);
          productAttributes = { error: 'Failed to parse attributes' };
        }

        generatedProductsWithAttributes.push({ name: productName, subcategory, attributes: productAttributes });
      }

      setGeneratedProducts(generatedProductsWithAttributes);
    } catch (error) {
      console.error('Error generating products:', error);
      setError('Failed to generate products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      for (const product of generatedProducts) {
        await addProduct({
          name: product.name,
          subcategory: product.subcategory,
          attributes: product.attributes
        });
      }
      alert('Products saved successfully!');
    } catch (error) {
      console.error('Error saving products:', error);
      setError('Failed to save products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Product Generator</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>}

      <div className="mb-4">
        <label className="block mb-2">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter product category"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Number of Products</label>
        <input
          type="number"
          value={productCount}
          onChange={(e) => setProductCount(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
          min="1"
          max="20"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select LLM Configuration</label>
        <select
          value={selectedLlmConfig}
          onChange={(e) => setSelectedLlmConfig(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {llmConfigs.map(config => (
            <option key={config.id} value={config.id}>{config.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerateProducts}
        disabled={!category || !selectedLlmConfig || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mr-2"
      >
        {loading ? 'Generating...' : 'Generate Products'}
      </button>

      {generatedProducts.length > 0 && (
        <button
          onClick={handleSaveProducts}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mr-2"
        >
          {loading ? 'Saving...' : 'Save Products'}
        </button>
      )}

      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
      </button>

      {generatedProducts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Generated Products</h3>
          <ul className="list-disc list-inside">
            {generatedProducts.map((product, index) => (
              <li key={index} className="mb-4">
                <strong>{product.name}</strong> (Subcategory: {product.subcategory})
                <ul className="list-none ml-4">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDebug && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Debug Information</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductGenerator;

