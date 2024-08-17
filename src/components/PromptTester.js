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

  useEffect(() => {
    loadPrompts();
    loadLlmConfigs();
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

  const handlePromptChange = (e) => {
    setSelectedPrompt(e.target.value);
  };

  const handleProductListChange = (e) => {
    setProductList(e.target.value);
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
        
        // Fetch the actual product data
        const productsData = await fetchProducts();
        const actualProduct = productsData.find(p => p.name.toLowerCase() === productName.toLowerCase());

        const correct = actualProduct ? Object.entries(llmResult.attributes).every(
          ([key, value]) => actualProduct.attributes[key] === value
        ) : false;

        resultsArray.push({
          name: productName,
          attributes: llmResult.attributes,
          correct,
          actualAttributes: actualProduct ? actualProduct.attributes : null,
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
                <th className="border p-2">Mapped Attributes</th>
                <th className="border p-2">Actual Attributes</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="border p-2">{result.name}</td>
                  <td className="border p-2">
                    {result.attributes ? (
                      <ul>
                        {Object.entries(result.attributes).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="border p-2">
                    {result.actualAttributes ? (
                      <ul>
                        {Object.entries(result.actualAttributes).map(([key, value]) => (
                          <li key={key}>{key}: {value}</li>
                        ))}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className={`border p-2 ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {result.error ? `Error: ${result.error}` : (result.correct ? 'Correct' : 'Incorrect')}
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