import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceMetrics = () => {
  const llmPerformanceData = {
    labels: ['GPT-3', 'BERT', 'RoBERTa'],
    datasets: [
      {
        label: 'Accuracy (%)',
        data: [85, 78, 82],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const humanReviewerPerformanceData = {
    labels: ['Reviewer 1', 'Reviewer 2', 'Reviewer 3'],
    datasets: [
      {
        label: 'Products Reviewed',
        data: [120, 95, 150],
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
        <h3 className="text-xl font-semibold mb-2">Human Reviewer Performance</h3>
        <Bar data={humanReviewerPerformanceData} options={options} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Activity Log</h3>
        <ul className="list-disc list-inside">
          <li>User 'John' reviewed 25 products - 2 hours ago</li>
          <li>LLM 'GPT-3' processed 100 products - 3 hours ago</li>
          <li>New prompt added for 'Flavor Profile' - 5 hours ago</li>
          <li>User 'Alice' corrected 15 product attributes - 1 day ago</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMetrics;

