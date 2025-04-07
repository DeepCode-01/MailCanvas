import React, { useState } from 'react';
import { Handle } from 'reactflow';

const DelayNode = ({ data, isConnectable }) => {
  const [delayValue, setDelayValue] = useState(data.value || 1);
  const [delayUnit, setDelayUnit] = useState(data.unit || 'days');

  const handleValueChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setDelayValue(value);
    if (data.onChange) {
      data.onChange({ ...data, value, unit: delayUnit });
    }
  };

  const handleUnitChange = (e) => {
    setDelayUnit(e.target.value);
    if (data.onChange) {
      data.onChange({ ...data, value: delayValue, unit: e.target.value });
    }
  };

  return (
    <div className="p-3 rounded-md shadow-md bg-yellow-50 border-2 border-yellow-500 w-64">
      {/* Input handle */}
      <Handle
        type="target"
        position="top"
        id="target"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-yellow-500"
      />
      
      <div className="font-bold text-yellow-700 mb-2">Wait/Delay</div>
      
      <div className="flex space-x-2 items-center">
        <input
          type="number"
          min="1"
          className="w-16 bg-yellow-50 border border-yellow-300 rounded p-2 focus:outline-none focus:border-yellow-500"
          value={delayValue}
          onChange={handleValueChange}
        />
        
        <select
          className="bg-yellow-50 border border-yellow-300 rounded p-2 focus:outline-none focus:border-yellow-500"
          value={delayUnit}
          onChange={handleUnitChange}
        >
          <option value="minutes">Minute(s)</option>
          <option value="hours">Hour(s)</option>
          <option value="days">Day(s)</option>
          <option value="weeks">Week(s)</option>
        </select>
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position="bottom"
        id="source"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-yellow-500"
      />
    </div>
  );
};

export default DelayNode;