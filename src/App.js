import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductGenerator from './components/ProductGenerator';
import AttributeEditor from './components/AttributeEditor';
import AttributeEditorV2 from './components/AttributeEditorV2';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/product-generator">Product Generator</Link>
            </li>
            <li>
              <Link to="/attribute-editor">Attribute Editor</Link>
            </li>
            <li>
              <Link to="/attribute-editor-v2">Attribute Editor V2</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to the Product Attribute Value Tool</h1>} />
          <Route path="/product-generator" element={<ProductGenerator />} />
          <Route path="/attribute-editor" element={<AttributeEditor />} />
          <Route path="/attribute-editor-v2" element={<AttributeEditorV2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;