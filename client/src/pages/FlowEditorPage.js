import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlowEditor from '../components/FlowEditor/FlowEditor';
import { sequencesApi } from '../api';

function FlowEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sequence, setSequence] = useState({
    name: '',
    description: '',
    nodes: [],
    edges: []
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch sequence data if editing an existing sequence
  useEffect(() => {
    async function fetchSequence() {
      try {
        const response = await sequencesApi.getById(id);
        setSequence(response.data);
      } catch (error) {
        console.error("Error fetching sequence:", error);
        setError("Failed to load sequence. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchSequence();
    }
  }, [id]);

  // Handle sequence update
  const handleSave = useCallback(async (flowData) => {
    try {
      setSaving(true);
      const { name, description, nodes, edges } = flowData;
      
      const sequenceData = {
        name,
        description,
        nodes,
        edges
      };
      
      if (id) {
        await sequencesApi.update(id, sequenceData);
      } else {
        const response = await sequencesApi.create(sequenceData);
        navigate(`/editor/${response.data._id}`);
      }
      
      alert(id ? "Sequence updated successfully!" : "Sequence created successfully!");
    } catch (error) {
      console.error("Error saving sequence:", error);
      alert("Failed to save sequence. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [id, navigate]);

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
        <button 
          onClick={() => navigate('/sequences')}
          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Sequences
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? 'Edit Sequence' : 'Create New Sequence'}
        </h1>
      </div>
      
      <FlowEditor 
        initialData={sequence} 
        onSave={handleSave} 
        saving={saving} 
      />
    </div>
  );
}

export default FlowEditorPage;