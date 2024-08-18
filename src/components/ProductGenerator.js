import React, { useState, useEffect } from 'react';
import { debug, getDebugLog } from '../utils/debug';
import { fetchPrompts, generateProduct, saveProduct } from '../utils/api';

const ProductGenerator = () => {
  const [productName, setProductName] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [attributes, setAttributes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompts, setPrompts] = useState({ step1: '', step2: '' });
  const [debugInfo, setDebugInfo] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);

  useEffect(() => {
    fetchPromptsData();
  }, []);

  const fetchPromptsData = async () => {
    try {
      debug('Fetching prompts');
      const response = await fetchPrompts();
      debug('Raw prompts response', response.data);
      
      const step1Prompt = response.data.find(prompt => prompt.name === 'Step 1')?.content;
      const step2Prompt = response.data.find(prompt => prompt.name === 'Step 2')?.content;

      if (!step1Prompt || !step2Prompt) {
        throw new Error('One or both prompts are missing or empty');
      }

      setPrompts({ step1: step1Prompt, step2: step2Prompt });
      debug('Prompts fetched successfully', { step1: step1Prompt, step2: step2Prompt });
    } catch (error) {
      console.error('Error fetching prompts:', error);
      debug('Error fetching prompts', error);
      setError(`Failed to fetch prompts: ${error.message}`);
    }
  };

  const handleGenerateProduct = async () => {
    if (!productName) {
      setError('Please enter a product name.');
      return;
    }
    if (!prompts.step1 || !prompts.step2) {
      setError('Prompts are not loaded. Please try refreshing the page.');
      return;
    }
    setLoading(true);
    setError('');
    setDebugInfo('');
    try {
      debug('Generating product', { productName });
      // Step 1: Generate subcategory
      const step1Prompt = prompts.step1.replace('$productname', productName);
      debug('Step 1 prompt', step1Prompt);
      const step1Response = await generateProduct(step1Prompt);
      const generatedSubcategory = step1Response.data.response.trim();
      setSubcategory(generatedSubcategory);
      debug('Generated subcategory', generatedSubcategory);
      setDebugInfo(prevDebug => prevDebug + `Step 1 Response:\n${generatedSubcategory}\n\n`);

      // Step 2: Generate attributes
      const step2Prompt = prompts.step2.replace('$productname', productName).replace('$subcategory', generatedSubcategory);
      debug('Step 2 prompt', step2Prompt);
      const step2Response = await generateProduct(step2Prompt);
      setDebugInfo(prevDebug => prevDebug + `Step 2 Response:\n${step2Response.data.response}\n\n`);
      const generatedAttributes = JSON.parse(step2Response.data.response);
      setAttributes(generatedAttributes);
      debug('Generated attributes', generatedAttributes);

      // Add generated product to the list
      setGeneratedProducts(prevProducts => [...prevProducts, { name: productName, subcategory: generatedSubcategory, attributes: generatedAttributes }]);
    } catch (error) {
      console.error('Error generating product:', error);
      debug('Error generating product', error);
      setError(`Failed to generate product: ${error.message}`);
      setDebugInfo(prevDebug => prevDebug + `Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (product) => {
    try {
      debug('Saving product', product);
      await saveProduct(product);
      debug('Product saved successfully');
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      debug('Error saving product', error);
      setError(`Failed to save product: ${error.message}`);
    }
  };

  const handlePromptChange = (step, value) => {
    setPrompts(prevPrompts => ({ ...prevPrompts, [step]: value }));
  };

  const copyDebugLog = () => {
    navigator.clipboard.writeText(getDebugLog());
    alert('Debug log copied to clipboard!');
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
      <button
        onClick={() => setShowPrompts(!showPrompts)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showPrompts ? 'Hide Prompts' : 'Show Prompts'}
      </button>
      {showPrompts && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Prompts:</h2>
          <div className="mb-2">
            <h3 className="font-bold">Step 1 (Subcategory):</h3>
            <textarea
              value={prompts.step1}
              onChange={(e) => handlePromptChange('step1', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="4"
            />
          </div>
          <div>
            <h3 className="font-bold">Step 2 (Attributes):</h3>
            <textarea
              value={prompts.step2}
              onChange={(e) => handlePromptChange('step2', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="4"
            />
          </div>
        </div>
      )}
      <button
        onClick={handleGenerateProduct}
        disabled={loading || !prompts.step1 || !prompts.step2}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        {loading ? 'Generating...' : 'Generate Product'}
      </button>
      <button
        onClick={copyDebugLog}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
      >
        Copy Debug Log
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {generatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Generated Products:</h2>
          {generatedProducts.map((product, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p>Subcategory: {product.subcategory}</p>
              <h4 className="font-bold mt-2">Attributes:</h4>
              <pre className="bg-gray-100 p-2 rounded mt-1">
                {JSON.stringify(product.attributes, null, 2)}
              </pre>
              <button
                onClick={() => handleSaveProduct(product)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Save Product
              </button>
            </div>
          ))}
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

