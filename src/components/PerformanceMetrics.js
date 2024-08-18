import React, { useState, useEffect } from 'react';
import { getTokenUsage, getGraderPerformance, getLlmPerformance } from '../api/api';
import { Line, Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const PerformanceMetrics = () => {
  const [tokenUsage, setTokenUsage] = useState({});
  const [graderPerformance, setGraderPerformance] = useState([]);
  const [llmPerformance, setLlmPerformance] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tokenData, graderData, llmData] = await Promise.all([
        getTokenUsage(startDate, endDate),
        getGraderPerformance(startDate, endDate),
        getLlmPerformance(startDate, endDate)
      ]);
      setTokenUsage(tokenData);
      setGraderPerformance(graderData);
      setLlmPerformance(llmData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch performance data');
      setLoading(false);
    }
  };

  const tokenUsageData = {
    labels: Object.keys(tokenUsage),
    datasets: [
      {
        label: 'Token Usage',
        data: Object.values(tokenUsage),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const graderPerformanceData = {
    labels: graderPerformance.map(grader => grader.name),
    datasets: [
      {
        label: 'Accuracy',
        data: graderPerformance.map(grader => grader.accuracy),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Speed (products/hour)',
        data: graderPerformance.map(grader => grader.speed),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const llmPerformanceData = {
    labels: llmPerformance.map(llm => llm.name),
    datasets: [
      {
        label: 'Accuracy',
        data: llmPerformance.map(llm => llm.accuracy),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Performance Metrics</h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Date Range</h2>
        <div className="flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="p-2 border rounded"
          />
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="p-2 border rounded"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Usage</h2>
        <Bar data={tokenUsageData} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Grader Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Rank</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Accuracy</th>
                <th className="py-2 px-4 text-left">Speed (products/hour)</th>
                <th className="py-2 px-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {graderPerformance
                .sort((a, b) => b.score - a.score)
                .map((grader, index) => (
                  <tr key={grader.name} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{grader.name}</td>
                    <td className="py-2 px-4">{grader.accuracy.toFixed(2)}%</td>
                    <td className="py-2 px-4">{grader.speed}</td>
                    <td className="py-2 px-4">{grader.score.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">LLM Performance</h2>
        <Bar data={llmPerformanceData} />
      </div>
    </div>
  );
};

export default PerformanceMetrics;