import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import ProductGenerator from './components/ProductGenerator';
import AttributeEditor from './components/AttributeEditor';
import HumanGrader from './components/HumanGrader';
import HumanGraderV2 from './components/HumanGraderV2';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import UserManagement from './components/UserManagement';
import ReportsDashboard from './components/ReportsDashboard';
import PromptTester from './components/PromptTester';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<ProductGenerator />} />
          <Route path="/grader" element={<HumanGrader />} />
          <Route path="/grader-v2" element={<HumanGraderV2 />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/prompts" element={<PromptManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/attributes" element={<AttributeEditor />} />
          <Route path="/reports" element={<ReportsDashboard />} />
          <Route path="/prompt-tester" element={<PromptTester />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

