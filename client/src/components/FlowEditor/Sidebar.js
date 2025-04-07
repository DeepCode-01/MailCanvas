import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white p-4 border-l border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Flow Nodes</h3>
        <p className="text-sm text-gray-500">Drag nodes to the canvas</p>
      </div>
      
      <div className="space-y-3">
        <div 
          className="p-3 border border-green-500 bg-green-50 rounded-md cursor-move"
          onDragStart={(event) => onDragStart(event, 'leadSource')}
          draggable
        >
          <div className="font-medium">Lead Source</div>
          <div className="text-xs text-gray-500">Define where leads come from</div>
        </div>
        
        <div 
          className="p-3 border border-blue-500 bg-blue-50 rounded-md cursor-move"
          onDragStart={(event) => onDragStart(event, 'emailNode')}
          draggable
        >
          <div className="font-medium">Email</div>
          <div className="text-xs text-gray-500">Configure email content</div>
        </div>
        
        <div 
          className="p-3 border border-amber-500 bg-amber-50 rounded-md cursor-move"
          onDragStart={(event) => onDragStart(event, 'delayNode')}
          draggable
        >
          <div className="font-medium">Wait/Delay</div>
          <div className="text-xs text-gray-500">Add time between steps</div>
        </div>
      </div>
      
      <div className="mt-8 p-3 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tips</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag nodes from here to the canvas</li>
          <li>• Connect nodes by dragging between handles</li>
          <li>• Click on a node to edit its properties</li>
          <li>• Save your sequence when finished</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;