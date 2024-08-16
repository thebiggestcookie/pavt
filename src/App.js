import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UploadInterface from './components/UploadInterface';
import HumanGraderInterface from './components/HumanGraderInterface';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import PerformanceMetrics from './components/PerformanceMetrics';
import UserManagement from './components/UserManagement';
import { fetchProducts, fetchAttributes } from './api/api';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
        const attributesData = await fetchAttributes();
        setAttributes(attributesData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

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

