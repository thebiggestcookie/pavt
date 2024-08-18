import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductGenerator = () => {
  const [productName, setProductName] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [attributes, setAttributes] = useState({});
  const [prompts, setPrompts] = useState([]);
  const [llmConfigs, setLlmConfigs] = useState([]);
  const [selectedPrompt1, setSelectedPrompt1] = useState('');
  const [selectedPrompt2, setSelectedPrompt2] = useState('');
  const [selectedLlmConfig, setSelectedLlmConfig] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);

  useEffect(() => {
    fetchPrompts();
    fetchLlmConfigs();
    fetchSubcategories();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await axios.get('/api/prompts');
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setError('Failed to fetch prompts');
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

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to fetch subcategories');
    }
  };

  const fetchSubcategoryAttributes = async (subcategory) => {
    try {
      const response = await axios.get(`/api/subcategory-attributes/${subcategory}`);
      setSubcategoryAttributes(response.data);
    } catch (error) {
      console.error('Error fetching subcategory attributes:', error);
      setError('Failed to fetch subcategory attributes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedLlmConfigData = llmConfigs.find(c => c.id === parseInt(selectedLlmConfig));
      
      // Step 1: Identify subcategory
      const subcategoryResponse = await axios.post('/api/process-llm', {
        prompt: prompts.find(p => p.id === parseInt(selectedPrompt1)).content,
        productName: productName,
        llmConfig: selectedLlmConfigData
      });
      const identifiedSubcategory = subcategoryResponse.data.attributes.trim();
      setSubcategory(identifiedSubcategory);

      // Fetch attributes for the identified subcategory
      await fetchSubcategoryAttributes(identifiedSubcategory);

      // Step 2: Generate attributes
      const attributesResponse = await axios.post('/api/process-llm', {
        prompt: prompts.find(p => p.id === parseInt(selectedPrompt2)).content,
        productName: productName,
        subcategory: identifiedSubcategory,
        llmConfig: selectedLlmConfigData
      });

      let parsedAttributes;
      try {
        parsedAttributes = JSON.parse(attributesResponse.data.attributes);
      } catch (parseError) {
        console.error('Error parsing attributes:', parseError);
        throw new Error('Failed to parse attributes. The LLM response was not valid JSON.');
      }

      setAttributes(parsedAttributes);

      // Save the generated product to the database
      await axios.post('/api/products', {
        name: productName,
        subcategory: identifiedSubcategory,
        attributes: parsedAttributes
      });

    } catch (error) {
      console.error('Error generating product:', error);
      setError('Failed to generate product attributes: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Product Generator</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">
            Product Name:
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="prompt1" className="block text-gray-700 text-sm font-bold mb-2">
            Subcategory Identification Prompt:
          </label>
          <select
            id="prompt1"
            value={selectedPrompt1}
            onChange={(e) => setSelectedPrompt1(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a prompt</option>
            {prompts.filter(p => p.step === 1).map(prompt => (
              <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="prompt2" className="block text-gray-700 text-sm font-bold mb-2">
            Attribute Generation Prompt:
          </label>
          <select
            id="prompt2"
            value={selectedPrompt2}
            onChange={(e) => setSelectedPrompt2(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a prompt</option>
            {prompts.filter(p => p.step === 2).map(prompt => (
              <option key={prompt.id} value={prompt.id}>{prompt.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="llmConfig" className="block text-gray-700 text-sm font-bold mb-2">
            LLM Configuration:
          </label>
          <select
            id="llmConfig"
            value={selectedLlmConfig}
            onChange={(e) => setSelectedLlmConfig(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select an LLM configuration</option>
            {llmConfigs.map(config => (
              <option key={config.id} value={config.id}>{config.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Product'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {subcategory && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Generated Subcategory:</h2>
          <p className="text-gray-700">{subcategory}</p>
        </div>
      )}
      {Object.keys(attributes).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Generated Attributes:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(attributes, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductGenerator;