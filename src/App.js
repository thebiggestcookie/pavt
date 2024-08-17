import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import UploadInterface from './components/UploadInterface';
import HumanGraderInterface from './components/HumanGraderInterface';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import PerformanceMetrics from './components/PerformanceMetrics';
import UserManagement from './components/UserManagement';
import AttributeEditor from './components/AttributeEditor';
import InvestorDashboard from './components/InvestorDashboard';
import PromptTester from './components/PromptTester';
import ProductGenerator from './components/ProductGenerator';
import Login from './components/Login';
import { fetchProducts, fetchAttributes } from './api/api';

const App = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [attributes, setAttributes] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    loadInitialData();
  }, []);

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

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );

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
              <li><Link to="/product-generator" className="text-blue-600 hover:text-blue-800 font-medium">Product Generator</Link></li>
            </ul>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={UploadInterface} />
            <PrivateRoute
              path="/grader"
              render={(props) => (
                <HumanGraderInterface
                  {...props}
                  products={products}
                  currentProductIndex={currentProductIndex}
                  setCurrentProductIndex={setCurrentProductIndex}
                  attributes={attributes}
                  setAttributes={setAttributes}
                  setProducts={setProducts}
                />
              )}
            />
            <PrivateRoute path="/admin" component={AdminPanel} />
            <PrivateRoute path="/prompts" component={PromptManagement} />
            <PrivateRoute path="/metrics" component={PerformanceMetrics} />
            <PrivateRoute path="/users" component={UserManagement} />
            <PrivateRoute path="/attributes" component={AttributeEditor} />
            <PrivateRoute path="/investor" component={InvestorDashboard} />
            <PrivateRoute path="/prompt-tester" component={PromptTester} />
            <PrivateRoute path="/product-generator" component={ProductGenerator} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;