import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Attribute Value Tool Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Human Grader" link="/grader" description="Grade products manually" />
        <DashboardCard title="Human Grader V2" link="/grader-v2" description="Enhanced version of manual product grading" />
        <DashboardCard title="Prompt Management" link="/prompts" description="Manage and edit prompts" />
        <DashboardCard title="Product Generator" link="/product-generator" description="Generate new products" />
        <DashboardCard title="Reports" link="/reports" description="View and analyze reports" />
        <DashboardCard title="Attribute Editor" link="/attributes" description="Edit product attributes" />
        <DashboardCard title="Admin Panel" link="/admin" description="Access admin controls" />
        <DashboardCard title="User Management" link="/users" description="Manage user accounts" />
        <DashboardCard title="Prompt Tester" link="/prompt-tester" description="Test prompts" />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, link, description }) => {
  return (
    <Link to={link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default Dashboard;

