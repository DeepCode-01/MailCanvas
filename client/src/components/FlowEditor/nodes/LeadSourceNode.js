import React from 'react';
import { Handle } from 'reactflow';

const LeadSourceNode = ({ data, isConnectable, id }) => {
  return (
    <div className="node lead-source-node">
      <div className="node-header">Lead Source</div>
      <div className="node-content">
        <div className="form-group">
          <label htmlFor={`source-name-${id}`}>Source Name:</label>
          <input
            id={`source-name-${id}`}
            type="text"
            value={data.sourceName}
            onChange={(e) => data.onChange({ ...data, sourceName: e.target.value })}
            className="node-input"
          />
        </div>
        <div className="form-group">
          <label>Leads:</label>
          <div className="lead-count">{data.leadCount || 0}</div>
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

export default LeadSourceNode;