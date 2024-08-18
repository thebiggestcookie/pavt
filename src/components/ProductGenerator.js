import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductGenerator = () => {
  const [subcategory, setSubcategory] = useState('');
  const [attributes, setAttributes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompts, setPrompts] = useState({ step1: '', step2: '' });

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
    setLoading(true);
    setError('');
    try {
      // Step 1: Generate subcategory
      const step1Response = await axios.post('/api/generate', { prompt: prompts.step1 });
      const generatedSubcategory = step1Response.data.response.trim();
      setSubcategory(generatedSubcategory);

      // Step 2: Generate attributes
      const step2Prompt = prompts.step2.replace('{subcategory}', generatedSubcategory);
      const step2Response = await axios.post('/api/generate', { prompt: step2Prompt });
      const generatedAttributes = JSON.parse(step2Response.data.response);
      setAttributes(generatedAttributes);
    } catch (error) {
      console.error('Error generating product:', error);
      setError('Failed to generate product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Product Generator</h1>
      <button
        onClick={generateProduct}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Generating...' : 'Generate Product'}
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
    </div>
  );
};

export default ProductGenerator;

