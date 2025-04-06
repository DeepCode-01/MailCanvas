import React from 'react';
import { Handle } from 'reactflow';

const ColdEmailNode = ({ data, isConnectable, id }) => {
  return (
    <div className="node cold-email-node">
      <Handle
        type="target"
        position="top"
        isConnectable={isConnectable}
      />
      <div className="node-header">Cold Email</div>
      <div className="node-content">
        <div className="form-group">
          <label htmlFor={`subject-${id}`}>Subject:</label>
          <input
            id={`subject-${id}`}
            type="text"
            value={data.subject}
            onChange={(e) => data.onChange({ ...data, subject: e.target.value })}
            className="node-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor={`body-${id}`}>Body:</label>
          <textarea
            id={`body-${id}`}
            value={data.body}
            onChange={(e) => data.onChange({ ...data, body: e.target.value })}
            className="node-textarea"
            rows={3}
          />
        </div>
      </div>
      <Handle
        type="source"
        position="bottom"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ColdEmailNode;