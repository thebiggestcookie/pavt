import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import UploadInterface from './components/UploadInterface';
import HumanGraderInterface from './components/HumanGraderInterface';
import AdminPanel from './components/AdminPanel';
import PromptManagement from './components/PromptManagement';
import PerformanceMetrics from './components/PerformanceMetrics';
import AttributeManager from './components/AttributeManager';

const App = () => {
  const [showAttributeManager, setShowAttributeManager] = useState(false);

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
            <li><button onClick={() => setShowAttributeManager(!showAttributeManager)} className="text-blue-500 hover:text-blue-700">
              {showAttributeManager ? 'Hide' : 'Show'} Attribute Manager
            </button></li>
          </ul>
        </nav>

        {showAttributeManager && <AttributeManager />}

        <Switch>
          <Route exact path="/" component={UploadInterface} />
          <Route path="/grader" component={HumanGraderInterface} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/prompts" component={PromptManagement} />
          <Route path="/metrics" component={PerformanceMetrics} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;