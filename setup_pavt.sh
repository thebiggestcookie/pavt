#!/bin/bash

# Create project directory
mkdir -p pavt
cd pavt

# Initialize npm and create package.json
npm init -y

# Update package.json
cat > package.json << EOL
{
  "name": "pavt",
  "version": "1.0.0",
  "description": "Product Attribute Verifier Tool",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "dev": "react-scripts start"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "engines": {
    "node": ">=14.x"
  }
}
EOL

# Install dependencies
npm install

# Create public directory and index.html
mkdir -p public
cat > public/index.html << EOL
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Product Attribute Verifier Tool</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOL

# Create src directory and App.js
mkdir -p src
cat > src/App.js << EOL
import React, { useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

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

  const currentProduct = products[currentProductIndex];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Product Attribute Verifier Tool (PAVT)</h1>
      <input type="file" onChange={handleFileUpload} accept=".csv" />
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
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, e.target.value)}
                      style={{ width: '100%' }}
                    />
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

# Create src/index.js
cat > src/index.js << EOL
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Create server.js
cat > server.js << EOL
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
EOL

# Create .gitignore
cat > .gitignore << EOL
node_modules
build
.env
EOL

# Initialize git repository
git init
git add .
git commit -m "Initial commit of PAVT"

echo "PAVT project has been set up successfully!"
echo "To start the development server, run: npm run dev"
echo "To build the project for production, run: npm run build"
echo "To start the production server, run: npm start"
