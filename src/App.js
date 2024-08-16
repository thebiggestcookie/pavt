import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UploadInterface from './components/UploadInterface';
import HumanGraderInterface from './components/HumanGraderInterface';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import PerformanceMetrics from './components/PerformanceMetrics';
import UserManagement from './components/UserManagement';

const App = () => {
  const [products, setProducts] = useState([
    {
      name: "Mountain Blend Coffee",
      attributes: [
        { name: "Origin", value: "Colombia", correct: null },
        { name: "OrganicStatus", value: "Yes", correct: null },
        { name: "Intensity", value: "7", correct: null },
        { name: "FlavorProfile", value: "Nutty, Chocolate", correct: null },
        { name: "RoastLevel", value: "Medium", correct: null }
      ]
    },
    // ... (other product entries)
  ]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({
    Origin: ['Colombia', 'Brazil', 'Ethiopia', 'Indonesia', 'Guatemala', 'Costa Rica', 'Hawaii', 'Switzerland', 'Iceland', 'Italy'],
    OrganicStatus: ['Yes', 'No'],
    Intensity: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    FlavorProfile: ['Nutty', 'Chocolate', 'Caramel', 'Citrus', 'Fruity', 'Floral', 'Vanilla', 'Smoky', 'Earthy', 'Balanced', 'Smooth', 'Mild', 'Rich', 'Bold'],
    RoastLevel: ['Light', 'Medium', 'Dark']
  });

  return (
    <Router>
      <div className="container mx-auto px-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-blue-500 hover:text-blue-700">Upload</Link></li>
            <li><Link to="/grader" className="text-blue-500 hover:text-blue-700">Human Grader</Link></li>
            <li><Link to="/admin" className="text-blue-500 hover:text-blue-700">Admin Panel</Link></li>
            <li><Link to="/prompts" className="text-blue-500 hover:text-blue-700">Prompt Management</Link></li>
            <li><Link to="/metrics" className="text-blue-500 hover:text-blue-700">Performance Metrics</Link></li>
            <li><Link to="/users" className="text-blue-500 hover:text-blue-700">User Management</Link></li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <UploadInterface setProducts={setProducts} setAttributes={setAttributes} />
          </Route>
          <Route path="/grader">
            <HumanGraderInterface
              products={products}
              currentProductIndex={currentProductIndex}
              setCurrentProductIndex={setCurrentProductIndex}
              attributes={attributes}
              setAttributes={setAttributes}
              setProducts={setProducts}
            />
          </Route>
          <Route path="/admin">
            <AdminPanel />
          </Route>
          <Route path="/prompts">
            <PromptManagement />
          </Route>
          <Route path="/metrics">
            <PerformanceMetrics />
          </Route>
          <Route path="/users">
            <UserManagement />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;