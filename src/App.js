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

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});
  const [showAttributeManager, setShowAttributeManager] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    console.log('File upload started');
    setIsLoading(true);
    setError(null);
    const file = event.target.files[0];
    console.log('File selected:', file.name);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      console.log('File read successfully');
      try {
        const text = e.target.result;
        console.log('File content length:', text.length);
        
        const lines = text.split('\n').filter(line => line.trim() !== '');
        console.log('Number of lines:', lines.length);
        
        const headers = lines[0].split(',').map(header => header.trim());
        console.log('Headers:', headers);

        if (lines.length <= 1) {
          throw new Error('CSV file appears to be empty or contains only headers');
        }

        const productsData = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(value => value.trim());
          console.log(`Product ${index + 1} values:`, values);
          
          if (values.length !== headers.length) {
            console.warn(`Product ${index + 1} has ${values.length} values, expected ${headers.length}`);
          }
          
          const product = { name: values[0], attributes: [] };
          for (let i = 1; i < headers.length; i++) {
            product.attributes.push({ 
              name: headers[i], 
              value: values[i] || '', 
              correct: null 
            });
          }
          return product;
        });
        
        console.log('Processed products:', productsData);

        if (productsData.length === 0) {
          throw new Error('No products were parsed from the CSV');
        }

        setProducts(productsData);
        console.log('Products state updated');

        const initialAttributes = {};
        headers.slice(1).forEach(header => {
          initialAttributes[header] = [...new Set(productsData.map(p => 
            p.attributes.find(a => a.name === header)?.value
          ).filter(Boolean))];
        });
        
        console.log('Initial attributes:', initialAttributes);
        setAttributes(initialAttributes);
        console.log('Attributes state updated');
        
        setCurrentProductIndex(0);
        setError(null);
        console.log('File processing completed successfully');
      } catch (err) {
        console.error('Error processing file:', err);
        setError(`Error processing file: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = (err) => {
      console.error('Error reading file:', err);
      setError('Error reading file. Please try again.');
      setIsLoading(false);
    };

    reader.readAsText(file);
    console.log('File read initiated');
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
      <input type="file" onChange={handleFileUpload} accept=".csv" disabled={isLoading} />
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setShowAttributeManager(!showAttributeManager)}>
        {showAttributeManager ? 'Hide' : 'Show'} Attribute Manager
      </button>
      {showAttributeManager && (
        <AttributeManager 
          attributes={attributes} 
          onUpdateAttributes={setAttributes}
        />
      )}
      {products.length > 0 && currentProduct && (
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
                      {attributes[attr.name]?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <button onClick={() => {
                      const newVariable = prompt(`Enter new variable for ${attr.name}`);
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
