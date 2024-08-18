import React, { useState, useEffect } from 'react';
import { debug, getDebugLog } from '../utils/debug';
import { fetchPrompts, generateProduct, saveProduct } from '../utils/api';
import { attributes } from '../data/attributes';

const ProductGenerator = () => {
  const [productName, setProductName] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompts, setPrompts] = useState({ step1: '', step2: '', step3: '' });
  const [debugInfo, setDebugInfo] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);
  const [sampleProducts, setSampleProducts] = useState([]);

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
      const step3Prompt = response.data.find(prompt => prompt.name === 'Step 3')?.content;

      if (!step1Prompt || !step2Prompt || !step3Prompt) {
        throw new Error('One or more prompts are missing or empty');
      }

      setPrompts({ step1: step1Prompt, step2: step2Prompt, step3: step3Prompt });
      debug('Prompts fetched successfully', { step1: step1Prompt, step2: step2Prompt, step3: step3Prompt });
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
    if (!prompts.step1 || !prompts.step2 || !prompts.step3) {
      setError('Prompts are not loaded. Please try refreshing the page.');
      return;
    }
    setLoading(true);
    setError('');
    setDebugInfo('');
    try {
      debug('Generating product', { productName });
      
      // Step 1: Generate 5 sample products
      const step1Prompt = prompts.step1.replace('$productname', productName);
      debug('Step 1 prompt', step1Prompt);
      const step1Response = await generateProduct(step1Prompt);
      const generatedSamples = JSON.parse(step1Response.data.response);
      setSampleProducts(generatedSamples);
      debug('Generated sample products', generatedSamples);
      setDebugInfo(prevDebug => prevDebug + `Step 1 Response:\n${JSON.stringify(generatedSamples, null, 2)}\n\n`);

      // Step 2: Match subcategory
      const step2Prompt = prompts.step2.replace('$sampleproducts', JSON.stringify(generatedSamples));
      debug('Step 2 prompt', step2Prompt);
      const step2Response = await generateProduct(step2Prompt);
      const matchedSubcategory = step2Response.data.response.trim();
      setSubcategory(matchedSubcategory);
      debug('Matched subcategory', matchedSubcategory);
      setDebugInfo(prevDebug => prevDebug + `Step 2 Response:\n${matchedSubcategory}\n\n`);

      // Step 3: Generate attributes
      const subcategoryAttributes = attributes[matchedSubcategory];
      const step3Prompt = prompts.step3
        .replace('$productname', productName)
        .replace('$subcategory', matchedSubcategory)
        .replace('$attributes', JSON.stringify(subcategoryAttributes));
      debug('Step 3 prompt', step3Prompt);
      const step3Response = await generateProduct(step3Prompt);
      const generatedAttributes = JSON.parse(step3Response.data.response);
      debug('Generated attributes', generatedAttributes);
      setDebugInfo(prevDebug => prevDebug + `Step 3 Response:\n${JSON.stringify(generatedAttributes, null, 2)}\n\n`);

      // Add generated product to the list
      setGeneratedProducts(prevProducts => [...prevProducts, { name: productName, subcategory: matchedSubcategory, attributes: generatedAttributes }]);
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
          {Object.entries(prompts).map(([step, prompt]) => (
            <div key={step} className="mb-2">
              <h3 className="font-bold">{step.charAt(0).toUpperCase() + step.slice(1)}:</h3>
              <textarea
                value={prompt}
                onChange={(e) => handlePromptChange(step, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows="4"
              />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleGenerateProduct}
        disabled={loading || !prompts.step1 || !prompts.step2 || !prompts.step3}
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
      {sampleProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Sample Products:</h2>
          <ul className="list-disc pl-5">
            {sampleProducts.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      )}
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

