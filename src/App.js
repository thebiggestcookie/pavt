import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UploadInterface from './components/UploadInterface';
import HumanGraderInterface from './components/HumanGraderInterface';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import PerformanceMetrics from './components/PerformanceMetrics';
import UserManagement from './components/UserManagement';
import AttributeEditor from './components/AttributeEditor';
import InvestorDashboard from './components/InvestorDashboard';
import PromptTester from './components/PromptTester';
import { fetchProducts, fetchAttributes } from './api/api';
import { coffeeProducts } from './data/coffeeProducts';

const App = () => {
  const [products, setProducts] = useState(coffeeProducts);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData.length > 0 ? productsData : coffeeProducts);
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
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-3">
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">Upload</Link></li>
              <li><Link to="/grader" className="text-blue-600 hover:text-blue-800 font-medium">Human Grader</Link></li>
              <li><Link to="/admin" className="text-blue-600 hover:text-blue-800 font-medium">Admin Panel</Link></li>
              <li><Link to="/prompts" className="text-blue-600 hover:text-blue-800 font-medium">Prompt Management</Link></li>
              <li><Link to="/metrics" className="text-blue-600 hover:text-blue-800 font-medium">Performance Metrics</Link></li>
              <li><Link to="/users" className="text-blue-600 hover:text-blue-800 font-medium">User Management</Link></li>
              <li><Link to="/attributes" className="text-blue-600 hover:text-blue-800 font-medium">Attribute Editor</Link></li>
              <li><Link to="/investor" className="text-blue-600 hover:text-blue-800 font-medium">Investor Dashboard</Link></li>
              <li><Link to="/prompt-tester" className="text-blue-600 hover:text-blue-800 font-medium">Prompt Tester</Link></li>
            </ul>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
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
            <Route path="/attributes">
              <AttributeEditor />
            </Route>
            <Route path="/investor">
              <InvestorDashboard />
            </Route>
            <Route path="/prompt-tester">
              <PromptTester />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;

