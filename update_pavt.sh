#!/bin/bash

# Update App.js
cat > src/App.js << EOL
import React, { useState, useEffect } from 'react';
import AttributeManager from './AttributeManager';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});
  const [showAttributeManager, setShowAttributeManager] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const productsData = lines.slice(1).map(line => {
        const values = line.split(',');
        const product = { name: values[0], attributes: [] };
        for (let i = 1; i < headers.length; i++) {
          product.attributes.push({ name: headers[i], value: values[i], correct: null });
        }
        return product;
      });
      setProducts(productsData);

      // Initialize attributes
      const initialAttributes = {};
      headers.slice(1).forEach(header => {
        initialAttributes[header] = [...new Set(productsData.map(p => p.attributes.find(a => a.name === header)?.value).filter(Boolean))];
      });
      setAttributes(initialAttributes);
    };
    reader.readAsText(file);
  };

  const handleAttributeChange = (attributeIndex, newValue) => {
    const updatedProducts = [...products];
    updatedProducts[currentProductIndex].attributes[attributeIndex].value = newValue;
    updatedProducts[currentProductIndex].attributes[attributeIndex].correct = true;
    setProducts(updatedProducts);
  };

  const moveToNextProduct = () => {
    if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      alert('All products verified!');
    }
  };

  const handleAddNewVariable = (attributeName, newVariable) => {
    setAttributes(prevAttributes => ({
      ...prevAttributes,
      [attributeName]: [...prevAttributes[attributeName], newVariable]
    }));
  };

  const currentProduct = products[currentProductIndex];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Product Attribute Verifier Tool (PAVT)</h1>
      <input type="file" onChange={handleFileUpload} accept=".csv" />
      <button onClick={() => setShowAttributeManager(!showAttributeManager)}>
        {showAttributeManager ? 'Hide' : 'Show'} Attribute Manager
      </button>
      {showAttributeManager && (
        <AttributeManager 
          attributes={attributes} 
          onUpdateAttributes={setAttributes}
        />
      )}
      {products.length > 0 && (
        <div>
          <h2>{currentProduct.name}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Attribute</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {currentProduct.attributes.map((attr, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{attr.name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <select
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, e.target.value)}
                      style={{ width: '100%' }}
                    >
                      {attributes[attr.name].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <button onClick={() => {
                      const newVariable = prompt(\`Enter new variable for \${attr.name}\`);
                      if (newVariable) handleAddNewVariable(attr.name, newVariable);
                    }}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={moveToNextProduct} style={{ marginTop: '20px' }}>Next Product</button>
          <p>Verifying product {currentProductIndex + 1} of {products.length}</p>
        </div>
      )}
    </div>
  );
};

export default App;
EOL

# Create AttributeManager.js
cat > src/AttributeManager.js << EOL
import React, { useState, useEffect } from 'react';

const AttributeManager = ({ attributes, onUpdateAttributes }) => {
  const [localAttributes, setLocalAttributes] = useState(attributes);

  useEffect(() => {
    setLocalAttributes(attributes);
  }, [attributes]);

  const handleAddVariable = (attributeName, newVariable) => {
    const updatedAttributes = {...localAttributes};
    if (!updatedAttributes[attributeName].includes(newVariable)) {
      updatedAttributes[attributeName] = [...updatedAttributes[attributeName], newVariable];
      setLocalAttributes(updatedAttributes);
      onUpdateAttributes(updatedAttributes);
    }
  };

  const handleRemoveVariable = (attributeName, variable) => {
    const updatedAttributes = {...localAttributes};
    updatedAttributes[attributeName] = updatedAttributes[attributeName].filter(v => v !== variable);
    setLocalAttributes(updatedAttributes);
    onUpdateAttributes(updatedAttributes);
  };

  return (
    <div>
      <h2>Attribute Manager</h2>
      {Object.entries(localAttributes).map(([attributeName, variables]) => (
        <div key={attributeName}>
          <h3>{attributeName}</h3>
          <ul>
            {variables.map(variable => (
              <li key={variable}>
                {variable}
                <button onClick={() => handleRemoveVariable(attributeName, variable)}>Remove</button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="New variable"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddVariable(attributeName, e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AttributeManager;
EOL

# Update package.json to ensure all necessary dependencies are included
npm install react@latest react-dom@latest react-scripts@latest

echo "PAVT project has been updated successfully!"
echo "To start the development server, run: npm start"
