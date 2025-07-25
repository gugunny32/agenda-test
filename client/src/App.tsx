import React, { useState, useEffect } from 'react';
import './App.css';
import JobsList from './components/JobsList';
import JobForm from './components/JobForm';
import StatusPanel from './components/StatusPanel';

export interface Job {
  _id: string;
  name: string;
  type: string;
  data: any;
  priority: number;
  repeatInterval: string | null;
  repeatTimezone: string | null;
  nextRunAt: string | null;
  lastModifiedBy: string | null;
  lastRunAt: string | null;
  lastFinishedAt: string | null;
  failedAt: string | null;
  failReason: string | null;
}

export interface ServerStatus {
  status: string;
  agenda: string;
  uptime: number;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    }
  };

  const createJob = async (name: string, interval: string, data: any) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, interval, data })
      });
      if (!response.ok) throw new Error('Failed to create job');
      await fetchJobs(); // Refresh jobs list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      return false;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete job');
      await fetchJobs(); // Refresh jobs list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchStatus()]);
      setLoading(false);
    };

    loadData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(() => {
      fetchJobs();
      fetchStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading Agenda Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🗓️ Agenda Job Scheduler Dashboard</h1>
        <p>Manage and monitor your scheduled jobs</p>
      </header>
      
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <main className="App-main">
        <div className="dashboard-grid">
          <section className="status-section">
            <StatusPanel status={status} />
          </section>
          
          <section className="form-section">
            <JobForm onSubmit={createJob} />
          </section>
          
          <section className="jobs-section">
            <JobsList jobs={jobs} onDelete={deleteJob} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
