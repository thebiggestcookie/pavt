import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getTokenUsage, getGraderPerformance, getLlmPerformance } from '../api/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceMetrics = () => {
  const [tokenUsage, setTokenUsage] = useState({});
  const [graderPerformance, setGraderPerformance] = useState([]);
  const [llmPerformance, setLlmPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usageData, graderData, llmData] = await Promise.all([
          getTokenUsage(),
          getGraderPerformance(),
          getLlmPerformance()
        ]);
        setTokenUsage(usageData);
        setGraderPerformance(graderData);
        setLlmPerformance(llmData);
      } catch (err) {
        console.error('Error fetching performance data:', err);
        setError('Failed to load performance data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const llmPerformanceData = {
    labels: llmPerformance.map(llm => llm.name),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: llmPerformance.map(llm => llm.accuracy),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const tokenUsageData = {
    labels: Object.keys(tokenUsage),
    datasets: [
      {
        label: 'Token Usage',
        data: Object.values(tokenUsage),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const graderPerformanceData = {
    labels: graderPerformance.map(grader => grader.name),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: graderPerformance.map(grader => grader.accuracy),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
      {
        label: 'Speed (products/hour)',
        data: graderPerformance.map(grader => grader.speed),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
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

  if (loading) {
    return <div className="mt-8">Loading performance metrics...</div>;
  }

  if (error) {
    return <div className="mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
      
      {llmPerformance.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">LLM Performance</h3>
          <Bar data={llmPerformanceData} options={options} />
        </div>
      )}

      {Object.keys(tokenUsage).length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Token Usage</h3>
          <Bar data={tokenUsageData} options={options} />
        </div>
      )}

      {graderPerformance.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Grader Performance</h3>
          <Bar data={graderPerformanceData} options={options} />
        </div>
      )}

      {llmPerformance.length === 0 && Object.keys(tokenUsage).length === 0 && graderPerformance.length === 0 && (
        <p>No performance data available yet.</p>
      )}
    </div>
  );
};

export default PerformanceMetrics;

