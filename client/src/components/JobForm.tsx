import React, { useState } from 'react';
import './JobForm.css';

interface JobFormProps {
  onSubmit: (name: string, interval: string, data: any) => Promise<boolean>;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [interval, setInterval] = useState('');
  const [data, setData] = useState('{}');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetJobs = [
    { name: 'fetch_user_name', interval: '10 seconds', description: 'Fetch user data from API' },
    { name: 'cleanup_logs', interval: '1 hour', description: 'Clean up old log files' },
    { name: 'send_notifications', interval: '30 minutes', description: 'Send pending notifications' },
    { name: 'backup_database', interval: '1 day', description: 'Create database backup' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !interval.trim()) return;

    setIsSubmitting(true);
    
    try {
      let parsedData = {};
      if (data.trim()) {
        try {
          // eslint-disable-next-line no-implied-eval
          parsedData = JSON.parse(data);
        } catch (jsonError) {
          throw new Error('Invalid JSON data: ' + jsonError);
        }
      }
      
      const success = await onSubmit(name.trim(), interval.trim(), parsedData);
      if (success) {
        setName('');
        setInterval('');
        setData('{}');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Invalid data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetClick = (preset: typeof presetJobs[0]) => {
    setName(preset.name);
    setInterval(preset.interval);
    setData('{}');
  };

  return (
    <div className="job-form">
      <h2>➕ Schedule New Job</h2>
      
      <div className="presets">
        <h3>Quick Presets:</h3>
        <div className="preset-buttons">
          {presetJobs.map((preset, index) => (
            <button
              key={index}
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick(preset)}
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="job-name">Job Name:</label>
          <input
            id="job-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., fetch_user_data"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="job-interval">Interval:</label>
          <input
            id="job-interval"
            type="text"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            placeholder="e.g., 5 minutes, 1 hour, 30 seconds"
            required
          />
          <small>
            Examples: "5 seconds", "10 minutes", "1 hour", "2 days"
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="job-data">Job Data (JSON):</label>
          <textarea
            id="job-data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder='{"key": "value"}'
            rows={3}
          />
          <small>
            Optional JSON data to pass to the job
          </small>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !name.trim() || !interval.trim()}
          className="submit-btn"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Job'}
        </button>
      </form>
    </div>
  );
};

export default JobForm;