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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

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
        {isAuthenticated && (
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
        )}

        <div className="container mx-auto px-6 py-8">
          <Switch>
            <Route exact path="/login" render={(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />} />
            <PrivateRoute exact path="/" component={UploadInterface} />
            <PrivateRoute path="/grader" component={HumanGraderInterface} />
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