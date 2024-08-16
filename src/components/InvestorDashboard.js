import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InvestorDashboard = () => {
  const [graderData, setGraderData] = useState([]);
  const [promptData, setPromptData] = useState([]);

  useEffect(() => {
    // Simulated data fetch
    setGraderData([
      { name: 'Alice', accuracy: 95, speed: 120, hoursWorked: 40 },
      { name: 'Bob', accuracy: 88, speed: 100, hoursWorked: 35 },
      { name: 'Charlie', accuracy: 92, speed: 110, hoursWorked: 38 },
      { name: 'Diana', accuracy: 97, speed: 130, hoursWorked: 42 },
      { name: 'Ethan', accuracy: 85, speed: 90, hoursWorked: 37 },
      { name: 'Fiona', accuracy: 93, speed: 115, hoursWorked: 39 },
      { name: 'George', accuracy: 89, speed: 105, hoursWorked: 36 },
      { name: 'Hannah', accuracy: 94, speed: 125, hoursWorked: 41 },
      { name: 'Ian', accuracy: 91, speed: 108, hoursWorked: 38 },
      { name: 'Julia', accuracy: 96, speed: 122, hoursWorked: 40 },
    ]);

    setPromptData([
      { name: 'Product Categorization', tokensUsed: 500000 },
      { name: 'Attribute Extraction', tokensUsed: 750000 },
      { name: 'Quality Check', tokensUsed: 300000 },
    ]);
  }, []);

  const graderChartData = {
    labels: graderData.map(grader => grader.name),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: graderData.map(grader => grader.accuracy),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Speed (products/hour)',
        data: graderData.map(grader => grader.speed),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const promptChartData = {
    labels: promptData.map(prompt => prompt.name),
    datasets: [
      {
        label: 'Tokens Used',
        data: promptData.map(prompt => prompt.tokensUsed),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Grader Performance',
      },
    },
  };

  const calculateTotalCost = () => {
    const graderCost = graderData.reduce((total, grader) => total + grader.hoursWorked * 4, 0);
    const promptCost = promptData.reduce((total, prompt) => total + (prompt.tokensUsed / 1000000) * 5, 0);
    return (graderCost + promptCost).toFixed(2);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Investor Dashboard</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Grader Performance</h3>
        <Bar data={graderChartData} options={options} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Prompt Usage</h3>
        <Bar data={promptChartData} options={{ ...options, plugins: { ...options.plugins, title: { display: true, text: 'Prompt Token Usage' } } }} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Cost Analysis</h3>
        <p>Total Grader Cost: ${graderData.reduce((total, grader) => total + grader.hoursWorked * 4, 0).toFixed(2)}</p>
        <p>Total Prompt Cost: ${promptData.reduce((total, prompt) => total + (prompt.tokensUsed / 1000000) * 5, 0).toFixed(2)}</p>
        <p className="font-bold">Total Cost: ${calculateTotalCost()}</p>
      </div>
    </div>
  );
};

export default InvestorDashboard;

