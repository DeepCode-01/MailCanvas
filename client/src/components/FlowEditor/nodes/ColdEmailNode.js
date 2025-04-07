// src/components/FlowEditor/nodes/EmailNode.js
import React, { useState } from 'react';
import { Handle } from 'reactflow';

const EmailNode = ({ data, isConnectable }) => {
  const [subject, setSubject] = useState(data.subject || '');
  const [body, setBody] = useState(data.body || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    if (data.onChange) {
      data.onChange({ ...data, subject: e.target.value });
    }
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    if (data.onChange) {
      data.onChange({ ...data, body: e.target.value });
    }
  };

  return (
    <div className="p-3 rounded-md shadow-md bg-blue-50 border-2 border-blue-500 w-64">
      {/* Input handle */}
      <Handle
        type="target"
        position="top"
        id="target"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      
      <div className="font-bold text-blue-700 mb-2">
        <div className="flex justify-between items-center">
          <span>Email</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        <input
          className="w-full bg-blue-50 border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500"
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Email Subject"
        />
      </div>
      
      {isExpanded && (
        <div className="mb-2">
          <textarea
            className="w-full bg-blue-50 border border-blue-300 rounded p-2 focus:outline-none focus:border-blue-500 resize-none"
            value={body}
            onChange={handleBodyChange}
            placeholder="Email Body"
            rows={5}
          />
        </div>
      )}
      
      {!isExpanded && (
        <div className="text-sm text-gray-500 truncate mb-2">
          {body || 'No content yet...'}
        </div>
      )}
      
      {/* Output handle */}
      <Handle
        type="source"
        position="bottom"
        id="source"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default EmailNode;