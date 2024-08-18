import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductGenerator = () => {
  const [productName, setProductName] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [attributes, setAttributes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompts, setPrompts] = useState({ step1: '', step2: '' });
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await axios.get('/api/prompts');
      setPrompts({
        step1: response.data.find(prompt => prompt.name === 'Product Generator Step 1')?.content || '',
        step2: response.data.find(prompt => prompt.name === 'Product Generator Step 2')?.content || ''
      });
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setError('Failed to fetch prompts. Please try again.');
    }
  };

  const generateProduct = async () => {
    if (!productName) {
      setError('Please enter a product name.');
      return;
    }
    setLoading(true);
    setError('');
    setDebugInfo('');
    try {
      // Step 1: Generate subcategory
      const step1Prompt = prompts.step1.replace('{product_name}', productName);
      const step1Response = await axios.post('/api/generate', { prompt: step1Prompt });
      const generatedSubcategory = step1Response.data.response.trim();
      setSubcategory(generatedSubcategory);
      setDebugInfo(prevDebug => prevDebug + `Step 1 Response:\n${generatedSubcategory}\n\n`);

      // Step 2: Generate attributes
      const step2Prompt = prompts.step2.replace('{product_name}', productName).replace('{subcategory}', generatedSubcategory);
      const step2Response = await axios.post('/api/generate', { prompt: step2Prompt });
      setDebugInfo(prevDebug => prevDebug + `Step 2 Response:\n${step2Response.data.response}\n\n`);
      const generatedAttributes = JSON.parse(step2Response.data.response);
      setAttributes(generatedAttributes);
    } catch (error) {
      console.error('Error generating product:', error);
      setError(`Failed to generate product: ${error.message}`);
      setDebugInfo(prevDebug => prevDebug + `Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    try {
      await axios.post('/api/products', { name: productName, subcategory, attributes });
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Product Generator</h1>
      <div className="mb-4">
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Prompts:</h2>
        <div className="mb-2">
          <h3 className="font-bold">Step 1:</h3>
          <pre className="bg-gray-100 p-2 rounded">{prompts.step1}</pre>
        </div>
        <div>
          <h3 className="font-bold">Step 2:</h3>
          <pre className="bg-gray-100 p-2 rounded">{prompts.step2}</pre>
        </div>
      </div>
      <button
        onClick={generateProduct}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        {loading ? 'Generating...' : 'Generate Product'}
      </button>
      <button
        onClick={saveProduct}
        disabled={!subcategory || Object.keys(attributes).length === 0}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Product
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {subcategory && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Generated Subcategory:</h2>
          <p>{subcategory}</p>
        </div>
      )}
      {Object.keys(attributes).length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Generated Attributes:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(attributes, null, 2)}
          </pre>
        </div>
      )}
      {debugInfo && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Debug Information:</h2>
          <pre className="bg-gray-100 p-4 rounded">{debugInfo}</pre>
        </div>
      )}
    </div>
  );
};

export default ProductGenerator;

