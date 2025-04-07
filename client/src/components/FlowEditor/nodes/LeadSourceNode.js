import React, { useState } from 'react';
import { Handle } from 'reactflow';

const LeadSourceNode = ({ data, isConnectable }) => {
  const [name, setName] = useState(data.name || 'Lead Source');
  const [description, setDescription] = useState(data.description || '');

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (data.onChange) {
      data.onChange({ ...data, name: e.target.value });
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (data.onChange) {
      data.onChange({ ...data, description: e.target.value });
    }
  };

  return (
    <div className="p-3 rounded-md shadow-md bg-green-50 border-2 border-green-500 w-64">
      <div className="font-bold text-green-700 mb-2">
        <input
          className="w-full bg-transparent border-b border-green-300 focus:border-green-500 outline-none p-1"
          value={name}
          onChange={handleNameChange}
          placeholder="Lead Source Name"
        />
      </div>
      
      <div className="mb-2">
        <textarea
          className="w-full bg-green-50 border border-green-300 rounded p-2 focus:outline-none focus:border-green-500 resize-none"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Describe your lead source..."
          rows={2}
        />
      </div>
      
      <div className="text-sm text-green-700">
        <select 
          className="w-full bg-green-50 border border-green-300 rounded p-1 focus:outline-none focus:border-green-500"
          defaultValue={data.sourceType || "manual"}
          onChange={(e) => data.onChange?.({ ...data, sourceType: e.target.value })}
        >
          <option value="manual">Manual Entry</option>
          <option value="csv">CSV Import</option>
          <option value="api">API Integration</option>
          <option value="form">Form Submissions</option>
        </select>
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position="bottom"
        id="source"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default LeadSourceNode;