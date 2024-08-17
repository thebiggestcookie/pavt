import React, { useState, useEffect } from 'react';
import { fetchLlmConfigs, processWithLLM } from '../api/api';

const ProductGenerator = () => {
  const [category, setCategory] = useState('');
  const [productCount, setProductCount] = useState(5);
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [selectedLlmConfig, setSelectedLlmConfig] = useState('');
  const [generatedProducts, setGeneratedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLlmConfigs();
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

  const handleGenerateProducts = async () => {
    setLoading(true);
    setError(null);
    setGeneratedProducts([]);

    const selectedLlmConfigData = llmConfigs.find(c => c.id === selectedLlmConfig);

    try {
      // Generate product list
      const productListPrompt = `Generate a list of ${productCount} unique product names for the ${category} category. Return the result as a JSON array of strings. Ensure the response is a valid JSON array.`;
      const productListResult = await processWithLLM(productListPrompt, '', selectedLlmConfigData);
      let productList;
      try {
        productList = JSON.parse(productListResult.attributes);
        if (!Array.isArray(productList)) {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.error('Error parsing product list:', productListResult.attributes);
        throw new Error('Failed to parse product list: ' + parseError.message);
      }

      // Generate attributes for each product
      const generatedProductsWithAttributes = [];
      for (const productName of productList) {
        const attributePrompt = `Generate realistic attributes for the product "${productName}" in the ${category} category. Return the result as a JSON object with key-value pairs representing the attributes and their values. Ensure the response is a valid JSON object.`;
        const attributeResult = await processWithLLM(attributePrompt, '', selectedLlmConfigData);
        let attributes;
        try {
          attributes = JSON.parse(attributeResult.attributes);
          if (typeof attributes !== 'object' || attributes === null) {
            throw new Error('Response is not an object');
          }
        } catch (parseError) {
          console.error('Error parsing attributes:', attributeResult.attributes);
          throw new Error('Failed to parse attributes: ' + parseError.message);
        }
        generatedProductsWithAttributes.push({ name: productName, attributes });
      }

      setGeneratedProducts(generatedProductsWithAttributes);
    } catch (error) {
      console.error('Error generating products:', error);
      setError('Failed to generate products: ' + error.message);
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
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate Products'}
      </button>

      {generatedProducts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Generated Products</h3>
          <ul className="list-disc list-inside">
            {generatedProducts.map((product, index) => (
              <li key={index} className="mb-4">
                <strong>{product.name}</strong>
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
    </div>
  );
};

export default ProductGenerator;

