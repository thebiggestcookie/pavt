import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import GlobalDebug from './components/GlobalDebug';
import Navigation from './components/Navigation';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><UploadInterface /></PrivateRoute>} />
              <Route path="/grader" element={<PrivateRoute><HumanGraderInterface /></PrivateRoute>} />
              <Route path="/grader-v2" element={<PrivateRoute><HumanGraderV2 /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
              <Route path="/prompts" element={<PrivateRoute><PromptManagement /></PrivateRoute>} />
              <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
              <Route path="/attributes" element={<PrivateRoute><AttributeEditor /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><InvestorDashboard /></PrivateRoute>} />
              <Route path="/prompt-tester" element={<PrivateRoute><PromptTester /></PrivateRoute>} />
              <Route path="/product-generator" element={<PrivateRoute><ProductGenerator /></PrivateRoute>} />
            </Routes>
          </div>
          <GlobalDebug />
        </div>
      </Router>
    </Provider>
  );
};

export default App;

