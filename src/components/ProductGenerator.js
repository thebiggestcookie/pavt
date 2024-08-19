import React, { useState, useEffect } from 'react';
import { debug, getDebugLog } from '../utils/debug';
import { fetchPrompts, generateProduct, saveProduct } from '../utils/api';

const ProductGenerator = () => {
  const [productName, setProductName] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompts, setPrompts] = useState({
    step1: 'Generate 5 realistic sample products for the given product type: $productname. Return the result as a JSON array of strings.',
    step2: 'Given the following sample products: $sampleproducts\n\nDetermine the most appropriate subcategory for these products from the following list:\n$subcategories\n\nReturn only the name of the subcategory.',
    step3: 'Given the product name "$productname" and the subcategory "$subcategory", generate appropriate values for the following attributes:\n\n$attributes\n\nReturn the result as a JSON object with attribute names as keys and generated values as values.'
  });
  const [debugInfo, setDebugInfo] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);
  const [sampleProducts, setSampleProducts] = useState([]);

  useEffect(() => {
    fetchPromptsData();
  }, []);

  const fetchPromptsData = async () => {
    try {
      const fetchedPrompts = await fetchPrompts();
      setPrompts(prevPrompts => ({
        ...prevPrompts,
        ...fetchedPrompts.reduce((acc, prompt) => {
          acc[`step${prompt.step}`] = prompt.content;
          return acc;
        }, {})
      }));
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setError('Failed to fetch prompts: ' + error.message);
    }
  };

  const handleGenerateProduct = async () => {
    if (!productName) {
      setError('Please enter a product name.');
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
      const generatedSamples = JSON.parse(step1Response.response);
      setSampleProducts(generatedSamples);
      debug('Generated sample products', generatedSamples);
      setDebugInfo(prevDebug => prevDebug + `Step 1 Response:\n${JSON.stringify(generatedSamples, null, 2)}\n\n`);

      // Step 2: Match subcategory
      const step2Prompt = prompts.step2.replace('$sampleproducts', JSON.stringify(generatedSamples));
      debug('Step 2 prompt', step2Prompt);
      const step2Response = await generateProduct(step2Prompt);
      const matchedSubcategory = step2Response.response.trim();
      setSubcategory(matchedSubcategory);
      debug('Matched subcategory', matchedSubcategory);
      setDebugInfo(prevDebug => prevDebug + `Step 2 Response:\n${matchedSubcategory}\n\n`);

      // Step 3: Generate attributes
      const step3Prompt = prompts.step3
        .replace('$productname', productName)
        .replace('$subcategory', matchedSubcategory);
      debug('Step 3 prompt', step3Prompt);
      const step3Response = await generateProduct(step3Prompt);
      const generatedAttributes = JSON.parse(step3Response.response);
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
        disabled={loading || !productName}
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