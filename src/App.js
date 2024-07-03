import React, { useState, useEffect } from 'react';
import AttributeManager from './AttributeManager';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});
  const [showAttributeManager, setShowAttributeManager] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        console.log('Headers:', headers); // Log headers

        const productsData = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          console.log(`Product ${index + 1} values:`, values); // Log each product's values
          const product = { name: values[0], attributes: [] };
          for (let i = 1; i < headers.length; i++) {
            product.attributes.push({ name: headers[i], value: values[i] || '', correct: null });
          }
          return product;
        });
        console.log('Processed products:', productsData); // Log processed products

        setProducts(productsData);

        // Initialize attributes
        const initialAttributes = {};
        headers.slice(1).forEach(header => {
          initialAttributes[header] = [...new Set(productsData.map(p => p.attributes.find(a => a.name === header)?.value).filter(Boolean))];
        });
        console.log('Initial attributes:', initialAttributes); // Log initial attributes
        setAttributes(initialAttributes);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error processing file:', err);
        setError('Error processing file. Please check the console for details.');
      }
    };
    reader.onerror = (err) => {
      console.error('Error reading file:', err);
      setError('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  // ... rest of the component code ...

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Product Attribute Verifier Tool (PAVT)</h1>
      <input type="file" onChange={handleFileUpload} accept=".csv" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setShowAttributeManager(!showAttributeManager)}>
        {showAttributeManager ? 'Hide' : 'Show'} Attribute Manager
      </button>
      {/* ... rest of the JSX ... */}
    </div>
  );
};

export default App;
