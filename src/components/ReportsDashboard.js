import React, { useState, useEffect } from 'react';
import { fetchReports } from '../utils/api';

const ReportsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const fetchedReports = await fetchReports();
      setReports(fetchedReports);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reports: ' + err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Reports Dashboard</h1>
      {reports.map(report => (
        <div key={report.id} className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-bold">{report.title}</h2>
          <p>{report.description}</p>
          {/* Add more report details and visualizations here */}
        </div>
      ))}
    </div>
  );
};

export default ReportsDashboard;

