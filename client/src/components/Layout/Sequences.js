import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sequencesApi } from '../api';

function Sequences() {
  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSequences() {
      try {
        const response = await sequencesApi.getAll();
        setSequences(response.data);
      } catch (error) {
        console.error("Error fetching sequences:", error);
        setError("Failed to load sequences. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchSequences();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sequence? This action cannot be undone.")) {
      try {
        await sequencesApi.delete(id);
        setSequences(sequences.filter(sequence => sequence._id !== id));
      } catch (error) {
        console.error("Error deleting sequence:", error);
        alert("Failed to delete sequence. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Email Sequences</h1>
        <Link
          to="/editor"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create New Sequence
        </Link>
      </div>
      
      {sequences.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {sequences.map((sequence) => (
              <li key={sequence._id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{sequence.name}</h3>
                      <p className="text-sm text-gray-500">
                        {sequence.description || 'No description provided'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Created: {new Date(sequence.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/editor/${sequence._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(sequence._id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 text-center">
            <p className="text-lg text-gray-500 mb-4">No email sequences found.</p>
            <Link
              to="/editor"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Your First Sequence
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sequences;