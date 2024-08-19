import React, { useState } from 'react';
import { testPrompt } from '../utils/api';

const PromptTester = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTestPrompt = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testPrompt(prompt);
      setResult(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to test prompt: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Prompt Tester</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32 p-2 border rounded mb-4"
        placeholder="Enter your prompt here"
      />
      <button
        onClick={handleTestPrompt}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Testing...' : 'Test Prompt'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PromptTester;