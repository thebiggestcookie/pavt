import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceMetrics = () => {
  const [tokenUsageData, setTokenUsageData] = useState([]);
  const [llmPerformanceData, setLlmPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tokenUsageResponse = await axios.get('/api/token-usage');
      const llmPerformanceResponse = await axios.get('/api/llm-performance');
      setTokenUsageData(tokenUsageResponse.data);
      setLlmPerformanceData(llmPerformanceResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Failed to fetch performance data. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading performance metrics...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (tokenUsageData.length === 0 && llmPerformanceData.length === 0) {
    return <div>No performance data available.</div>;
  }

  const tokenUsageChartData = {
    labels: tokenUsageData.map(d => d.date),
    datasets: [
      {
        label: 'Token Usage',
        data: tokenUsageData.map(d => d.token_count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const llmPerformanceChartData = {
    labels: llmPerformanceData.map(d => d.model),
    datasets: [
      {
        label: 'Accuracy',
        data: llmPerformanceData.map(d => d.accuracy),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const chartOptions = {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Performance Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Token Usage Over Time</h2>
          {tokenUsageData.length > 0 ? (
            <Bar data={tokenUsageChartData} options={chartOptions} />
          ) : (
            <p>No token usage data available.</p>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">LLM Performance</h2>
          {llmPerformanceData.length > 0 ? (
            <Bar data={llmPerformanceChartData} options={chartOptions} />
          ) : (
            <p>No LLM performance data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
