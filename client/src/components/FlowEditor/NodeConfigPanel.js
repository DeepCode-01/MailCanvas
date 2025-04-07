import React from 'react';

const NodeConfigPanel = ({ node, updateNodeData, onDeleteNode }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateNodeData(node.id, { [name]: value });
  };

  const renderNodeConfig = () => {
    switch (node.type) {
      case 'leadSource':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Name
              </label>
              <input
                type="text"
                name="label"
                value={node.data.label}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sources (comma separated)
              </label>
              <textarea
                name="sources"
                value={Array.isArray(node.data.sources) ? node.data.sources.join(', ') : ''}
                onChange={(e) => {
                  const sources = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                  updateNodeData(node.id, { sources });
                }}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Website, LinkedIn, etc."
              />
            </div>
          </>
        );
        
      case 'emailNode':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Name
              </label>
              <input
                type="text"
                name="label"
                value={node.data.label}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={node.data.subject || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email subject line"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Body
              </label>
              <textarea
                name="body"
                value={node.data.body || ''}
                onChange={handleChange}
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email content..."
              />
            </div>
          </>
        );
        
      case 'delayNode':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delay Name
              </label>
              <input
                type="text"
                name="label"
                value={node.data.label}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delay Type
              </label>
              <select
                name="delayType"
                value={node.data.delayType || 'fixed'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fixed">Fixed Time</option>
                <option value="variable">Variable Time</option>
              </select>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay Value
                </label>
                <input
                  type="number"
                  name="delayValue"
                  value={node.data.delayValue || 1}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  name="delayUnit"
                  value={node.data.delayUnit || 'days'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>
          </>
        );
        
      default:
        return <p>Select a node to configure</p>;
    }
  };

  return (
    <div className="w-80 bg-white p-4 border-l border-gray-200 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Node Configuration</h3>
        <button
          onClick={onDeleteNode}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
      
      {renderNodeConfig()}
    </div>
  );
};

export default NodeConfigPanel;