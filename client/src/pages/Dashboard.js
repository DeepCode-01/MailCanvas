// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listFlows, getScheduledEmails } from '../api/flowApi';

const Dashboard = () => {
  const [flows, setFlows] = useState([]);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [flowsData, emailsData] = await Promise.all([
          listFlows(),
          getScheduledEmails()
        ]);
        
        setFlows(flowsData);
        setEmails(emailsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Email Marketing Dashboard</h1>
        <Link to="/editor/new" className="btn btn-primary">
          Create New Sequence
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Sequences</h3>
          <div className="stat-value">{flows.filter(f => f.isActive).length}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Emails</h3>
          <div className="stat-value">{emails.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Sequences</h3>
          <div className="stat-value">{flows.length}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sequences-section">
          <h2>Your Email Sequences</h2>
          {flows.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any email sequences yet.</p>
              <Link to="/editor/new" className="btn btn-secondary">
                Create Your First Sequence
              </Link>
            </div>
          ) : (
            <div className="sequence-list">
              {flows.map((flow) => (
                <div key={flow._id} className="sequence-card">
                  <div className="sequence-header">
                    <h3>{flow.name}</h3>
                    <span className={`status ${flow.isActive ? 'active' : 'inactive'}`}>
                      {flow.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="sequence-meta">
                    <div>Created: {new Date(flow.createdAt).toLocaleDateString()}</div>
                    <div>Last Edited: {new Date(flow.lastEdited).toLocaleDateString()}</div>
                  </div>

                  <div className="sequence-stats">
                    <div>Nodes: {flow.nodes.length}</div>
                    <div>Emails: {flow.nodes.filter(n => n.type === 'coldEmail').length}</div>
                  </div>

                  <div className="sequence-actions">
                    <Link to={`/editor/${flow._id}`} className="btn btn-sm">
                      Edit
                    </Link>
                    <Link to={`/sequence/${flow._id}`} className="btn btn-sm btn-outline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="upcoming-emails-section">
          <h2>Upcoming Emails</h2>
          {emails.length === 0 ? (
            <div className="empty-state">
              <p>No emails scheduled for delivery.</p>
            </div>
          ) : (
            <div className="emails-list">
              {emails.slice(0, 5).map((email) => (
                <div key={email._id} className="email-item">
                  <div className="email-subject">{email.subject}</div>
                  <div className="email-recipient">To: {email.to}</div>
                  <div className="email-schedule">
                    Scheduled for: {new Date(email.scheduledFor).toLocaleString()}
                  </div>
                </div>
              ))}
              {emails.length > 5 && (
                <div className="view-more">
                  <Link to="/emails">View all {emails.length} scheduled emails</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;