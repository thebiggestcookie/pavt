import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
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

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

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
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/" element={<PrivateRoute><UploadInterface /></PrivateRoute>} />
            <Route path="/grader" element={<PrivateRoute><HumanGraderInterface /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
            <Route path="/prompts" element={<PrivateRoute><PromptManagement /></PrivateRoute>} />
            <Route path="/metrics" element={<PrivateRoute><PerformanceMetrics /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
            <Route path="/attributes" element={<PrivateRoute><AttributeEditor /></PrivateRoute>} />
            <Route path="/investor" element={<PrivateRoute><InvestorDashboard /></PrivateRoute>} />
            <Route path="/prompt-tester" element={<PrivateRoute><PromptTester /></PrivateRoute>} />
            <Route path="/product-generator" element={<PrivateRoute><ProductGenerator /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;