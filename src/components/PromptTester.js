import React, { useState, useEffect } from 'react';
import { fetchPrompts, fetchProducts, updateProduct } from '../api/api';

const PromptTester = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [productList, setProductList] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const promptsData = await fetchPrompts();
      setPrompts(promptsData);
    } catch (error) {
      console.error('Error loading prompts:', error);
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
    const products = productList.split(',').map(p => p.trim());
    const resultsArray = [];

    for (const productName of products) {
      try {
        // Simulating LLM processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real scenario, you would call the LLM API here
        const mockAttributes = {
          Origin: ['Colombia', 'Ethiopia', 'Brazil'][Math.floor(Math.random() * 3)],
          'Roast Level': ['Light', 'Medium', 'Dark'][Math.floor(Math.random() * 3)],
          'Flavor Profile': ['Fruity', 'Nutty', 'Chocolatey'][Math.floor(Math.random() * 3)],
          Organic: ['Yes', 'No'][Math.floor(Math.random() * 2)],
        };

        // Fetch the actual product data
        const productsData = await fetchProducts();
        const actualProduct = productsData.find(p => p.name.toLowerCase() === productName.toLowerCase());

        const correct = actualProduct ? Object.entries(mockAttributes).every(
          ([key, value]) => actualProduct.attributes[key] === value
        ) : false;

        resultsArray.push({
          name: productName,
          attributes: mockAttributes,
          correct,
          actualAttributes: actualProduct ? actualProduct.attributes : null,
        });

      } catch (error) {
        console.error(`Error processing product ${productName}:`, error);
        resultsArray.push({
          name: productName,
          error: 'Failed to process product',
        });
      }
    }

    setResults(resultsArray);
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Prompt Tester</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Select Prompt</label>
        <select
          value={selectedPrompt}
          onChange={handlePromptChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a prompt</option>
          {prompts.map(prompt => (
            <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
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
        disabled={!selectedPrompt || !productList || loading}
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
                    {result.correct ? 'Correct' : 'Incorrect'}
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

