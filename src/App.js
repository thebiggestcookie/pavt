import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import UploadInterface from './components/UploadInterface';
import HumanGraderInterface from './components/HumanGraderInterface';
import HumanGraderV2 from './components/HumanGraderV2';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import UserManagement from './components/UserManagement';
import AttributeEditor from './components/AttributeEditor';
import InvestorDashboard from './components/InvestorDashboard';
import PromptTester from './components/PromptTester';
import ProductGenerator from './components/ProductGenerator';
import Login from './components/Login';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-3">
              <ul className="flex space-x-4">
                <li><Link to="/" className="text-blue-600 hover:text-blue-800">Upload</Link></li>
                <li><Link to="/grader" className="text-blue-600 hover:text-blue-800">Human Grader</Link></li>
                <li><Link to="/grader-v2" className="text-blue-600 hover:text-blue-800">Human Grader V2</Link></li>
                <li><Link to="/admin" className="text-blue-600 hover:text-blue-800">Admin Panel</Link></li>
                <li><Link to="/prompts" className="text-blue-600 hover:text-blue-800">Prompt Management</Link></li>
                <li><Link to="/users" className="text-blue-600 hover:text-blue-800">User Management</Link></li>
                <li><Link to="/attributes" className="text-blue-600 hover:text-blue-800">Attribute Editor</Link></li>
                <li><Link to="/reports" className="text-blue-600 hover:text-blue-800">Reports Dashboard</Link></li>
                <li><Link to="/prompt-tester" className="text-blue-600 hover:text-blue-800">Prompt Tester</Link></li>
                <li><Link to="/product-generator" className="text-blue-600 hover:text-blue-800">Product Generator</Link></li>
              </ul>
            </div>
          </nav>

          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<UploadInterface />} />
              <Route path="/grader" element={<HumanGraderInterface />} />
              <Route path="/grader-v2" element={<HumanGraderV2 />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/prompts" element={<PromptManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/attributes" element={<AttributeEditor />} />
              <Route path="/reports" element={<InvestorDashboard />} />
              <Route path="/prompt-tester" element={<PromptTester />} />
              <Route path="/product-generator" element={<ProductGenerator />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;