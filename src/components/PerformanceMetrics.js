import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getTokenUsage } from '../api/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceMetrics = () => {
  const [tokenUsage, setTokenUsage] = useState({
    openai: 0,
    anthropic: 0,
    perplexity: 0
  });

  useEffect(() => {
    fetchTokenUsage();
  }, []);

  const fetchTokenUsage = async () => {
    try {
      const usage = await getTokenUsage();
      setTokenUsage(usage);
    } catch (error) {
      console.error('Error fetching token usage:', error);
    }
  };

  const llmPerformanceData = {
    labels: ['GPT-4', 'Claude', 'Perplexity'],
    datasets: [
      {
        label: 'Accuracy (%)',
        data: [85, 82, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const tokenUsageData = {
    labels: ['OpenAI', 'Anthropic', 'Perplexity'],
    datasets: [
      {
        label: 'Token Usage',
        data: [tokenUsage.openai, tokenUsage.anthropic, tokenUsage.perplexity],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">LLM Performance</h3>
        <Bar data={llmPerformanceData} options={options} />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Token Usage</h3>
        <Bar data={tokenUsageData} options={options} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Activity Log</h3>
        <ul className="list-disc list-inside">
          <li>User 'John' reviewed 25 products - 2 hours ago</li>
          <li>LLM 'GPT-4' processed 100 products - 3 hours ago</li>
          <li>New prompt added for 'Flavor Profile' - 5 hours ago</li>
          <li>User 'Alice' corrected 15 product attributes - 1 day ago</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMetrics;