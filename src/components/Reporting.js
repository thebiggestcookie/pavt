import React, { useState, useEffect } from 'react';
import { fetchTokenUsage, fetchLLMPerformance } from '../utils/api';

const Reporting = () => {
  const [tokenUsage, setTokenUsage] = useState([]);
  const [llmPerformance, setLLMPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportingData();
  }, []);

  const loadReportingData = async () => {
    try {
      setLoading(true);
      const [tokenUsageData, llmPerformanceData] = await Promise.all([
        fetchTokenUsage(),
        fetchLLMPerformance()
      ]);
      setTokenUsage(tokenUsageData);
      setLLMPerformance(llmPerformanceData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reporting data: ' + err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Reporting</h1>
      <h2>Token Usage</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Token Count</th>
          </tr>
        </thead>
        <tbody>
          {tokenUsage.map((usage, index) => (
            <tr key={index}>
              <td>{usage.date}</td>
              <td>{usage.token_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>LLM Performance</h2>
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {llmPerformance.map((performance, index) => (
            <tr key={index}>
              <td>{performance.model}</td>
              <td>{performance.accuracy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reporting;

