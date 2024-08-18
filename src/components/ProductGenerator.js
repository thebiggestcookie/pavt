import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveProduct } from '../utils/api';

const ProductGenerator = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [productName, setProductName] = useState('');
  const [generatedAttributes, setGeneratedAttributes] = useState({});
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [selectedLlmConfig, setSelectedLlmConfig] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubcategories();
    fetchLlmConfigs();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to fetch subcategories');
    }
  };

  const fetchLlmConfigs = async () => {
    try {
      const response = await axios.get('/api/llm-configs');
      setLlmConfigs(response.data);
    } catch (error) {
      console.error('Error fetching LLM configs:', error);
      setError('Failed to fetch LLM configurations');
    }
  };

  const handleGenerateProduct = async () => {
    setIsLoading(true);
    setError('');
    try {
      const selectedConfig = llmConfigs.find(config => config.id === parseInt(selectedLlmConfig));
      if (!selectedConfig) {
        throw new Error('No LLM configuration selected');
      }

      const prompt = `Generate attributes for a ${selectedSubcategory} product named "${productName}". Please provide the attributes in a JSON format.`;

      const response = await axios.post('/api/process-llm', {
        prompt,
        productName,
        subcategory: selectedSubcategory,
        llmConfig: selectedConfig
      });

      const attributes = JSON.parse(response.data.attributes);
      setGeneratedAttributes(attributes);

      // Save the generated product
      await saveProduct({
        name: productName,
        subcategory: selectedSubcategory,
        attributes: attributes
      });

    } catch (error) {
      console.error('Error generating product:', error);
      setError('Failed to generate product attributes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Product Generator</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategory">
          Subcategory
        </label>
        <select
          id="subcategory"
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select a subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.name}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
          Product Name
        </label>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter product name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="llmConfig">
          LLM Configuration
        </label>
        <select
          id="llmConfig"
          value={selectedLlmConfig}
          onChange={(e) => setSelectedLlmConfig(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select LLM configuration</option>
          {llmConfigs.map((config) => (
            <option key={config.id} value={config.id}>
              {config.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleGenerateProduct}
        disabled={isLoading || !selectedSubcategory || !productName || !selectedLlmConfig}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isLoading ? 'Generating...' : 'Generate Product'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {Object.keys(generatedAttributes).length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Attributes:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(generatedAttributes, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductGenerator;