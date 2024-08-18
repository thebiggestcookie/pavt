import React, { useState, useEffect } from 'react';
import { getDebugLog } from '../utils/debug';

const GlobalDebug = () => {
  const [debugLog, setDebugLog] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateDebugLog = () => {
      setDebugLog(getDebugLog());
    };

    // Update debug log every second
    const interval = setInterval(updateDebugLog, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const copyDebugLog = () => {
    navigator.clipboard.writeText(debugLog);
    alert('Debug log copied to clipboard!');
  };

  return (
    <div className="fixed bottom-0 right-0 m-4">
      <button
        onClick={toggleVisibility}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isVisible ? 'Hide Debug' : 'Show Debug'}
      </button>
      {isVisible && (
        <div className="mt-2 p-4 bg-white border border-gray-300 rounded shadow-lg max-w-2xl max-h-96 overflow-auto">
          <h3 className="text-lg font-bold mb-2">Global Debug Log</h3>
          <pre className="whitespace-pre-wrap">{debugLog}</pre>
          <button
            onClick={copyDebugLog}
            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
          >
            Copy Log
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalDebug;

