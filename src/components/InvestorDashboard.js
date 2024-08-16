import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const InvestorDashboard = () => {
  const [graderData, setGraderData] = useState([]);
  const [promptData, setPromptData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    // Simulated data fetch
    setGraderData([
      { name: 'Alice', accuracy: 95, speed: 120, hoursWorked: 40, productsGraded: 4800 },
      { name: 'Bob', accuracy: 88, speed: 100, hoursWorked: 35, productsGraded: 3500 },
      { name: 'Charlie', accuracy: 92, speed: 110, hoursWorked: 38, productsGraded: 4180 },
      { name: 'Diana', accuracy: 97, speed: 130, hoursWorked: 42, productsGraded: 5460 },
      { name: 'Ethan', accuracy: 85, speed: 90, hoursWorked: 37, productsGraded: 3330 },
      { name: 'Fiona', accuracy: 93, speed: 115, hoursWorked: 39, productsGraded: 4485 },
      { name: 'George', accuracy: 89, speed: 105, hoursWorked: 36, productsGraded: 3780 },
      { name: 'Hannah', accuracy: 94, speed: 125, hoursWorked: 41, productsGraded: 5125 },
      { name: 'Ian', accuracy: 91, speed: 108, hoursWorked: 38, productsGraded: 4104 },
      { name: 'Julia', accuracy: 96, speed: 122, hoursWorked: 40, productsGraded: 4880 },
    ]);

    setPromptData([
      { name: 'Product Categorization', tokensUsed: 500000, accuracy: 92 },
      { name: 'Attribute Extraction', tokensUsed: 750000, accuracy: 88 },
      { name: 'Quality Check', tokensUsed: 300000, accuracy: 95 },
    ]);

    setHistoricalData([
      { month: 'Jan', cost: 10000, revenue: 15000 },
      { month: 'Feb', cost: 12000, revenue: 18000 },
      { month: 'Mar', cost: 11000, revenue: 17000 },
      { month: 'Apr', cost: 13000, revenue: 20000 },
      { month: 'May', cost: 14000, revenue: 22000 },
      { month: 'Jun', cost: 15000, revenue: 24000 },
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
      {
        label: 'Accuracy (%)',
        data: promptData.map(prompt => prompt.accuracy),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const historicalChartData = {
    labels: historicalData.map(data => data.month),
    datasets: [
      {
        label: 'Cost',
        data: historicalData.map(data => data.cost),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Revenue',
        data: historicalData.map(data => data.revenue),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
        text: 'Performance Metrics',
      },
    },
  };

  const calculateTotalCost = () => {
    const graderCost = graderData.reduce((total, grader) => total + grader.hoursWorked * 4, 0);
    const promptCost = promptData.reduce((total, prompt) => total + (prompt.tokensUsed / 1000000) * 5, 0);
    return (graderCost + promptCost).toFixed(2);
  };

  const calculateROI = () => {
    const totalCost = parseFloat(calculateTotalCost());
    const totalRevenue = historicalData.reduce((total, data) => total + data.revenue, 0);
    return (((totalRevenue - totalCost) / totalCost) * 100).toFixed(2);
  };

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-6">Investor Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Grader Performance</h3>
          <Bar data={graderChartData} options={options} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Prompt Usage and Accuracy</h3>
          <Bar data={promptChartData} options={options} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Historical Cost and Revenue</h3>
        <Line data={historicalChartData} options={options} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Cost Analysis</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Metric</th>
              <th className="p-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Total Grader Cost</td>
              <td className="p-2">${graderData.reduce((total, grader) => total + grader.hoursWorked * 4, 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="p-2">Total Prompt Cost</td>
              <td className="p-2">${promptData.reduce((total, prompt) => total + (prompt.tokensUsed / 1000000) * 5, 0).toFixed(2)}</td>
            </tr>
            <tr className="font-bold">
              <td className="p-2">Total Cost</td>
              <td className="p-2">${calculateTotalCost()}</td>
            </tr>
            <tr className="font-bold text-green-600">
              <td className="p-2">ROI</td>
              <td className="p-2">{calculateROI()}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Grader Efficiency</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Accuracy</th>
              <th className="p-2 text-left">Speed</th>
              <th className="p-2 text-left">Hours Worked</th>
              <th className="p-2 text-left">Products Graded</th>
              <th className="p-2 text-left">Efficiency Score</th>
            </tr>
          </thead>
          <tbody>
            {graderData.map((grader) => (
              <tr key={grader.name}>
                <td className="p-2">{grader.name}</td>
                <td className="p-2">{grader.accuracy}%</td>
                <td className="p-2">{grader.speed}/hour</td>
                <td className="p-2">{grader.hoursWorked}</td>
                <td className="p-2">{grader.productsGraded}</td>
                <td className="p-2">{((grader.accuracy * grader.speed) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestorDashboard;

