import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const InvestorDashboard = () => {
  const [graderData, setGraderData] = useState([]);
  const [llmData, setLlmData] = useState([]);
  const [overallData, setOverallData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = () => {
    // Simulated data fetch
    setGraderData([
      { name: 'Alice', accuracy: 95, speed: 120, timeSpent: 40, medal: 'gold' },
      { name: 'Bob', accuracy: 88, speed: 100, timeSpent: 35, medal: 'silver' },
      { name: 'Charlie', accuracy: 92, speed: 110, timeSpent: 38, medal: 'bronze' },
      { name: 'Diana', accuracy: 97, speed: 130, timeSpent: 42, medal: 'gold' },
      { name: 'Ethan', accuracy: 85, speed: 90, timeSpent: 37, medal: '' },
    ]);

    setLlmData([
      { name: 'GPT-3', provider: 'OpenAI', model: 'text-davinci-002', accurate: 85, missing: 10, incorrect: 5 },
      { name: 'GPT-4', provider: 'OpenAI', model: 'gpt-4', accurate: 92, missing: 5, incorrect: 3 },
      { name: 'Claude', provider: 'Anthropic', model: 'claude-v1', accurate: 88, missing: 8, incorrect: 4 },
    ]);

    setOverallData({
      productsRatedToday: 1500,
      productsInBacklog: 3000,
      totalProductsRated: 50000,
    });
  };

  const renderMedal = (medal) => {
    switch (medal) {
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '';
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-6">Reports Dashboard</h2>
      
      <div className="mb-4">
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          isClearable={true}
          placeholderText="Select date range"
          className="p-2 border rounded"
        />
        <button onClick={() => setStartDate(new Date())} className="ml-2 p-2 bg-blue-500 text-white rounded">Today</button>
        <button onClick={() => {
          const now = new Date();
          setStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7));
          setEndDate(now);
        }} className="ml-2 p-2 bg-blue-500 text-white rounded">This Week</button>
        <button onClick={() => {
          const now = new Date();
          setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
          setEndDate(now);
        }} className="ml-2 p-2 bg-blue-500 text-white rounded">This Month</button>
        <button onClick={() => {
          setStartDate(null);
          setEndDate(null);
        }} className="ml-2 p-2 bg-blue-500 text-white rounded">All Time</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">User Performance</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Accuracy</th>
              <th className="p-2 text-left">Speed</th>
              <th className="p-2 text-left">Time Spent</th>
              <th className="p-2 text-left">Medal</th>
            </tr>
          </thead>
          <tbody>
            {graderData.map((grader) => (
              <tr key={grader.name}>
                <td className="p-2">{grader.name}</td>
                <td className="p-2">{grader.accuracy}%</td>
                <td className="p-2">{grader.speed}/hour</td>
                <td className="p-2">{grader.timeSpent} hours</td>
                <td className="p-2">{renderMedal(grader.medal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">LLM Performance</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Provider</th>
              <th className="p-2 text-left">Model</th>
              <th className="p-2 text-left">Accurate</th>
              <th className="p-2 text-left">Missing</th>
              <th className="p-2 text-left">Incorrect</th>
            </tr>
          </thead>
          <tbody>
            {llmData.map((llm) => (
              <tr key={llm.name}>
                <td className="p-2">{llm.name}</td>
                <td className="p-2">{llm.provider}</td>
                <td className="p-2">{llm.model}</td>
                <td className="p-2">{llm.accurate}</td>
                <td className="p-2">{llm.missing}</td>
                <td className="p-2">{llm.incorrect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Overall Performance</h3>
        <p>Products Rated Today: {overallData.productsRatedToday}</p>
        <p>Products in Backlog: {overallData.productsInBacklog}</p>
        <p>Total Products Rated: {overallData.totalProductsRated}</p>
      </div>
    </div>
  );
};

export default InvestorDashboard;

