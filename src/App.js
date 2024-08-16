import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UploadInterface from './components/UploadInterface';
import HumanGraderInterface from './components/HumanGraderInterface';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import PerformanceMetrics from './components/PerformanceMetrics';

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
    {
      name: "Sunrise Espresso",
      attributes: [
        { name: "Origin", value: "Brazil", correct: null },
        { name: "OrganicStatus", value: "No", correct: null },
        { name: "Intensity", value: "9", correct: null },
        { name: "FlavorProfile", value: "Caramel, Citrus", correct: null },
        { name: "RoastLevel", value: "Dark", correct: null }
      ]
    },
    {
      name: "Tropical Paradise Coffee",
      attributes: [
        { name: "Origin", value: "Hawaii", correct: null },
        { name: "OrganicStatus", value: "Yes", correct: null },
        { name: "Intensity", value: "5", correct: null },
        { name: "FlavorProfile", value: "Fruity, Floral", correct: null },
        { name: "RoastLevel", value: "Light", correct: null }
      ]
    },
    {
      name: "Alpine Frost Coffee",
      attributes: [
        { name: "Origin", value: "Switzerland", correct: null },
        { name: "OrganicStatus", value: "No", correct: null },
        { name: "Intensity", value: "6", correct: null },
        { name: "FlavorProfile", value: "Chocolate, Vanilla", correct: null },
        { name: "RoastLevel", value: "Medium", correct: null }
      ]
    },
    {
      name: "Midnight Roast",
      attributes: [
        { name: "Origin", value: "Indonesia", correct: null },
        { name: "OrganicStatus", value: "Yes", correct: null },
        { name: "Intensity", value: "10", correct: null },
        { name: "FlavorProfile", value: "Smoky, Earthy", correct: null },
        { name: "RoastLevel", value: "Dark", correct: null }
      ]
    },
    {
      name: "Golden Sunrise Blend",
      attributes: [
        { name: "Origin", value: "Ethiopia", correct: null },
        { name: "OrganicStatus", value: "Yes", correct: null },
        { name: "Intensity", value: "4", correct: null },
        { name: "FlavorProfile", value: "Floral, Citrus", correct: null },
        { name: "RoastLevel", value: "Light", correct: null }
      ]
    },
    {
      name: "Velvet Mocha Delight",
      attributes: [
        { name: "Origin", value: "Guatemala", correct: null },
        { name: "OrganicStatus", value: "No", correct: null },
        { name: "Intensity", value: "8", correct: null },
        { name: "FlavorProfile", value: "Chocolate, Nutty", correct: null },
        { name: "RoastLevel", value: "Medium", correct: null }
      ]
    },
    {
      name: "Rainforest Blend",
      attributes: [
        { name: "Origin", value: "Costa Rica", correct: null },
        { name: "OrganicStatus", value: "Yes", correct: null },
        { name: "Intensity", value: "6", correct: null },
        { name: "FlavorProfile", value: "Fruity, Balanced", correct: null },
        { name: "RoastLevel", value: "Medium", correct: null }
      ]
    },
    {
      name: "Arctic Chill Coffee",
      attributes: [
        { name: "Origin", value: "Iceland", correct: null },
        { name: "OrganicStatus", value: "No", correct: null },
        { name: "Intensity", value: "3", correct: null },
        { name: "FlavorProfile", value: "Smooth, Mild", correct: null },
        { name: "RoastLevel", value: "Light", correct: null }
      ]
    },
    {
      name: "Volcanic Espresso",
      attributes: [
        { name: "Origin", value: "Italy", correct: null },
        { name: "OrganicStatus", value: "No", correct: null },
        { name: "Intensity", value: "9", correct: null },
        { name: "FlavorProfile", value: "Rich, Bold", correct: null },
        { name: "RoastLevel", value: "Dark", correct: null }
      ]
    }
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
        </Switch>
      </div>
    </Router>
  );
};

export default App;

