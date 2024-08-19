import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/api';

const Navigation = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <ul className="flex flex-wrap space-x-4">
          <li><Link to="/" className="text-blue-600 hover:text-blue-800">Dashboard</Link></li>
          <li><Link to="/grader" className="text-blue-600 hover:text-blue-800">Human Grader</Link></li>
          <li><Link to="/grader-v2" className="text-blue-600 hover:text-blue-800">Human Grader V2</Link></li>
          <li><Link to="/admin" className="text-blue-600 hover:text-blue-800">Admin Panel</Link></li>
          <li><Link to="/prompts" className="text-blue-600 hover:text-blue-800">Prompt Management</Link></li>
          <li><Link to="/users" className="text-blue-600 hover:text-blue-800">User Management</Link></li>
          <li><Link to="/attributes" className="text-blue-600 hover:text-blue-800">Attribute Editor</Link></li>
          <li><Link to="/reports" className="text-blue-600 hover:text-blue-800">Reports Dashboard</Link></li>
          <li><Link to="/prompt-tester" className="text-blue-600 hover:text-blue-800">Prompt Tester</Link></li>
          <li><Link to="/product-generator" className="text-blue-600 hover:text-blue-800">Product Generator</Link></li>
          <li><button onClick={handleLogout} className="text-blue-600 hover:text-blue-800">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;