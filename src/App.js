import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductGenerator from './components/ProductGenerator';
import AttributeEditor from './components/AttributeEditor';
import AttributeEditorV2 from './components/AttributeEditorV2';
import HumanGrader from './components/HumanGrader';
import HumanGraderV2 from './components/HumanGraderV2';
import Reporting from './components/Reporting';
import LLMConfigurator from './components/LLMConfigurator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/product-generator">Product Generator</Link></li>
            <li><Link to="/attribute-editor">Attribute Editor</Link></li>
            <li><Link to="/attribute-editor-v2">Attribute Editor V2</Link></li>
            <li><Link to="/human-grader">Human Grader</Link></li>
            <li><Link to="/human-grader-v2">Human Grader V2</Link></li>
            <li><Link to="/reporting">Reporting</Link></li>
            <li><Link to="/llm-configurator">LLM Configurator</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to the Product Attribute Value Tool</h1>} />
          <Route path="/product-generator" element={<ProductGenerator />} />
          <Route path="/attribute-editor" element={<AttributeEditor />} />
          <Route path="/attribute-editor-v2" element={<AttributeEditorV2 />} />
          <Route path="/human-grader" element={<HumanGrader />} />
          <Route path="/human-grader-v2" element={<HumanGraderV2 />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/llm-configurator" element={<LLMConfigurator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

