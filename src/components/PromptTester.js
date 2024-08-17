import React, { useState, useEffect } from 'react';
import { fetchPrompts, fetchProducts, updateProduct, fetchLlmConfigs } from '../api/api';
import { processWithLLM } from '../services/llmService';

const PromptTester = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [productList, setProductList] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [selectedLlmConfig, setSelectedLlmConfig] = useState('');
  const [error, setError] = useState(null);
  const [humanGradedProducts, setHumanGradedProducts] = useState([]);

  useEffect(() => {
    loadPrompts();
    loadLlmConfigs();
    loadHumanGradedProducts();
  }, []);

  const loadPrompts = async () => {
    try {
      const promptsData = await fetchPrompts();
      setPrompts(promptsData);
      if (promptsData.length > 0) {
        setSelectedPrompt(promptsData[0].id);
      }
    } catch (error) {
      console.error('Error loading prompts:', error);
      setError('Failed to load prompts');
    }
  };

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

  const loadHumanGradedProducts = async () => {
    try {
      const products = await fetchProducts();
      setHumanGradedProducts(products);
    } catch (error) {
      console.error('Error loading human graded products:', error);
      setError('Failed to load human graded products');
    }
  };

  const handlePromptChange = (e) => {
    setSelectedPrompt(e.target.value);
  };

  const handleProductListChange = (e) => {
    setProductList(e.target.value);
  };

  const handleImportHumanGradedProducts = () => {
    const productNames = humanGradedProducts.map(product => product.name).join(', ');
    setProductList(productNames);
  };

  const executePrompt = async () => {
    setLoading(true);
    setError(null);
    const products = productList.split(',').map(p => p.trim());
    const resultsArray = [];

    const selectedPromptData = prompts.find(p => p.id === selectedPrompt);
    const selectedLlmConfigData = llmConfigs.find(c => c.id === selectedLlmConfig);

    for (const productName of products) {
      try {
        const llmResult = await processWithLLM(selectedPromptData.content, productName, selectedLlmConfigData);
        
        // Find the corresponding human graded product
        const humanGradedProduct = humanGradedProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());

        resultsArray.push({
          name: productName,
          llmAttributes: llmResult.attributes,
          humanGradedAttributes: humanGradedProduct ? humanGradedProduct.attributes : null,
          correct: humanGradedProduct ? compareAttributes(llmResult.attributes, humanGradedProduct.attributes) : null,
        });

      } catch (error) {
        console.error(`Error processing product ${productName}:`, error);
        resultsArray.push({
          name: productName,
          error: error.message || 'Failed to process product',
        });
      }
    }

    setResults(resultsArray);
    setLoading(false);
  };

  const compareAttributes = (llmAttributes, humanGradedAttributes) => {
    if (!humanGradedAttributes) return null;
    const keys = Object.keys(humanGradedAttributes);
    let correctCount = 0;
    for (const key of keys) {
      if (llmAttributes[key] === humanGradedAttributes[key]) {
        correctCount++;
      }
    }
    return correctCount / keys.length;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Prompt Tester</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>}

      <div className="mb-4">
        <label className="block mb-2">Select Prompt</label>
        <select
          value={selectedPrompt}
          onChange={handlePromptChange}
          className="w-full p-2 border rounded"
        >
          {prompts.map(prompt => (
            <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
          ))}
        </select>
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

      <div className="mb-4">
        <label className="block mb-2">Product List (comma-separated)</label>
        <textarea
          value={productList}
          onChange={handleProductListChange}
          className="w-full p-2 border rounded"
          rows="4"
        ></textarea>
        <button
          onClick={handleImportHumanGradedProducts}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Import Human Graded Products
        </button>
      </div>

      <button
        onClick={executePrompt}
        disabled={!selectedPrompt || !productList || !selectedLlmConfig || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Execute Prompt'}
      </button>

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Results</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">LLM Attributes</th>
                <th className="border p-2">Human Graded Attributes</th>
                <th className="border p-2">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="border p-2">{result.name}</td>
                  <td className="border p-2">
                    {result.llmAttributes ? (
                      <ul>
                        {Object.entries(result.llmAttributes).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="border p-2">
                    {result.humanGradedAttributes ? (
                      <ul>
                        {Object.entries(result.humanGradedAttributes).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="border p-2">
                    {result.correct !== null ? `${(result.correct * 100).toFixed(2)}%` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromptTester;

