import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { emailsApi } from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmails: 0,
    sentEmails: 0,
    pendingEmails: 0,
    sequences: 0
  });
  const [recentEmails, setRecentEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await emailsApi.getHistory();
        
        // Calculate stats
        const emails = response.data;
        const sent = emails.filter(email => email.status === 'sent').length;
        const pending = emails.filter(email => email.status === 'pending').length;
        
        setStats({
          totalEmails: emails.length,
          sentEmails: sent,
          pendingEmails: pending,
          sequences: new Set(emails.map(email => email.sequenceId)).size
        });
        
        // Get recent emails
        const recent = emails
          .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime))
          .slice(0, 5);
        setRecentEmails(recent);
      } catch (error) {
        console.error("Error fetching email data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Email Sequences
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.sequences}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Emails
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalEmails}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Sent Emails
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              {stats.sentEmails}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Pending Emails
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">
              {stats.pendingEmails}
            </dd>
          </div>
        </div>
      </div>
      
      {/* Recent Emails */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Emails
          </h3>
          <Link to="/sequences" className="text-sm text-blue-600 hover:text-blue-500">
            View all sequences
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {recentEmails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentEmails.map((email) => (
                    <tr key={email._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          email.status === 'sent' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {email.status === 'sent' ? 'Sent' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(email.scheduledTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No emails sent yet. Create a sequence to get started!
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/sequences" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
            >
              View All Sequences
            </Link>
            <Link
              to="/editor"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Sequence
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;