import React from 'react';
import { Job } from '../App';
import './JobsList.css';

interface JobsListProps {
  jobs: Job[];
  onDelete: (id: string) => Promise<boolean>;
}

const JobsList: React.FC<JobsListProps> = ({ jobs, onDelete }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getJobStatus = (job: Job) => {
    if (job.failedAt) return 'failed';
    if (job.lastFinishedAt) return 'completed';
    if (job.nextRunAt && new Date(job.nextRunAt) > new Date()) return 'scheduled';
    return 'unknown';
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete job "${name}"?`)) {
      await onDelete(id);
    }
  };

  return (
    <div className="jobs-list">
      <h2>📋 Active Jobs ({jobs.length})</h2>
      
      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs scheduled yet.</p>
          <p>Use the form above to create your first job!</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job._id} className={`job-card status-${getJobStatus(job)}`}>
              <div className="job-header">
                <h3>{job.name}</h3>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(job._id, job.name)}
                  title="Delete job"
                >
                  🗑️
                </button>
              </div>
              
              <div className="job-details">
                <div className="job-field">
                  <span className="label">Status:</span>
                  <span className={`status status-${getJobStatus(job)}`}>
                    {getJobStatus(job)}
                  </span>
                </div>
                
                {job.repeatInterval && (
                  <div className="job-field">
                    <span className="label">Interval:</span>
                    <span>{job.repeatInterval}</span>
                  </div>
                )}
                
                <div className="job-field">
                  <span className="label">Next Run:</span>
                  <span>{formatDate(job.nextRunAt)}</span>
                </div>
                
                <div className="job-field">
                  <span className="label">Last Run:</span>
                  <span>{formatDate(job.lastRunAt)}</span>
                </div>
                
                {job.failReason && (
                  <div className="job-field error">
                    <span className="label">Error:</span>
                    <span>{job.failReason}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsList;