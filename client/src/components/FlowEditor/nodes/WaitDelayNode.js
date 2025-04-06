import React from 'react';
import { Handle } from 'reactflow';

const WaitDelayNode = ({ data, isConnectable, id }) => {
  const units = ['minutes', 'hours', 'days', 'weeks'];

  return (
    <div className="node wait-delay-node">
      <Handle
        type="target"
        position="top"
        isConnectable={isConnectable}
      />
      <div className="node-header">Wait/Delay</div>
      <div className="node-content">
        <div className="form-group delay-inputs">
          <input
            id={`delay-time-${id}`}
            type="number"
            min="1"
            value={data.delayTime}
            onChange={(e) => data.onChange({ ...data, delayTime: parseInt(e.target.value, 10) })}
            className="node-input delay-value"
          />
          <select
            id={`delay-unit-${id}`}
            value={data.delayUnit}
            onChange={(e) => data.onChange({ ...data, delayUnit: e.target.value })}
            className="node-select"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
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

export default WaitDelayNode;