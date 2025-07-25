import React from 'react';
import { ServerStatus } from '../App';
import './StatusPanel.css';

interface StatusPanelProps {
  status: ServerStatus | null;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ status }) => {
  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (!status) {
    return (
      <div className="status-panel">
        <h2>📊 Server Status</h2>
        <div className="status-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="status-panel">
      <h2>📊 Server Status</h2>
      
      <div className="status-grid">
        <div className="status-item">
          <div className="status-label">Server</div>
          <div className={`status-value status-${status.status}`}>
            <span className="status-indicator"></span>
            {status.status}
          </div>
        </div>
        
        <div className="status-item">
          <div className="status-label">Agenda</div>
          <div className={`status-value status-${status.agenda}`}>
            <span className="status-indicator"></span>
            {status.agenda}
          </div>
        </div>
        
        <div className="status-item">
          <div className="status-label">Uptime</div>
          <div className="status-value">
            {formatUptime(status.uptime)}
          </div>
        </div>
        
        <div className="status-item">
          <div className="status-label">Last Updated</div>
          <div className="status-value">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;