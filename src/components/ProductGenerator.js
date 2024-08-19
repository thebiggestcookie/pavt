import React, { useState, useEffect } from 'react';
import { debug, getDebugLog } from '../utils/debug';
import { fetchPrompts, generateProduct, saveProduct, fetchLLMConfigs, fetchSubcategories, fetchAttributes } from '../utils/api';

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
  const [llmConfigs, setLLMConfigs] = useState([]);
  const [selectedLLMConfig, setSelectedLLMConfig] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    fetchPromptsData();
    fetchLLMConfigsData();
    fetchSubcategoriesData();
    fetchAttributesData();
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

  const fetchLLMConfigsData = async () => {
    try {
      const configs = await fetchLLMConfigs();
      setLLMConfigs(configs);
      if (configs.length > 0) {
        setSelectedLLMConfig(configs[0].id);
      }
    } catch (error) {
      console.error('Error fetching LLM configs:', error);
      setError('Failed to fetch LLM configs: ' + error.message);
    }
  };

  const fetchSubcategoriesData = async () => {
    try {
      const fetchedSubcategories = await fetchSubcategories();
      setSubcategories(fetchedSubcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to fetch subcategories: ' + error.message);
    }
  };

  const fetchAttributesData = async () => {
    try {
      const fetchedAttributes = await fetchAttributes();
      setAttributes(fetchedAttributes);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      setError('Failed to fetch attributes: ' + error.message);
    }
  };

  const handleGenerateProduct = async () => {
    if (!productName || !selectedLLMConfig) {
      setError('Please enter a product name and select an LLM configuration.');
      return;
    }
    setLoading(true);
    setError('');
    setDebugInfo('');
    try {
      debug('Generating product', { productName, llmConfig: selectedLLMConfig });
      
      // Step 1: Generate 5 sample products
      const step1Prompt = prompts.step1.replace('$productname', productName);
      debug('Step 1 prompt', step1Prompt);
      const step1Response = await generateProduct(step1Prompt, selectedLLMConfig);
      const generatedSamples = JSON.parse(step1Response.response);
      setSampleProducts(generatedSamples);
      debug('Generated sample products', generatedSamples);
      setDebugInfo(prevDebug => prevDebug + `Step 1 Response:\n${JSON.stringify(generatedSamples, null, 2)}\n\n`);

      // Step 2: Match subcategory for each sample product
      const matchedSubcategories = await Promise.all(generatedSamples.map(async (sample) => {
        const step2Prompt = prompts.step2
          .replace('$sampleproducts', JSON.stringify([sample]))
          .replace('$subcategories', subcategories.join(', '));
        debug('Step 2 prompt', step2Prompt);
        const step2Response = await generateProduct(step2Prompt, selectedLLMConfig);
        const matchedSubcategory = step2Response.response.trim();
        debug('Matched subcategory', { sample, matchedSubcategory });
        return { sample, subcategory: matchedSubcategory };
      }));
      setDebugInfo(prevDebug => prevDebug + `Step 2 Response:\n${JSON.stringify(matchedSubcategories, null, 2)}\n\n`);

      // Step 3: Generate attributes for each sample product
      const generatedProducts = await Promise.all(matchedSubcategories.map(async ({ sample, subcategory }) => {
        const relevantAttributes = attributes[subcategory] || [];
        const step3Prompt = prompts.step3
          .replace('$productname', sample)
          .replace('$subcategory', subcategory)
          .replace('$attributes', relevantAttributes.join(', '));
        debug('Step 3 prompt', step3Prompt);
        const step3Response = await generateProduct(step3Prompt, selectedLLMConfig);
        const generatedAttributes = JSON.parse(step3Response.response);
        debug('Generated attributes', { sample, subcategory, attributes: generatedAttributes });
        return { name: sample, subcategory, attributes: generatedAttributes };
      }));

      setGeneratedProducts(generatedProducts);
      setDebugInfo(prevDebug => prevDebug + `Step 3 Response:\n${JSON.stringify(generatedProducts, null, 2)}\n\n`);
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
      <div className="mb-4">
        <label htmlFor="llmConfig" className="block text-sm font-medium text-gray-700">
          LLM Configuration
        </label>
        <select
          id="llmConfig"
          value={selectedLLMConfig}
          onChange={(e) => setSelectedLLMConfig(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {llmConfigs.map((config) => (
            <option key={config.id} value={config.id}>{config.name}</option>
          ))}
        </select>
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
        disabled={loading || !productName || !selectedLLMConfig}
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

