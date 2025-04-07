import React from 'react';

const NodeContextMenu = ({ 
  x, 
  y, 
  onDelete, 
  onEdit, 
  onDuplicate, 
  onClose 
}) => {
  return (
    <div 
      className="absolute z-10 bg-white rounded shadow-lg border border-gray-200"
      style={{ top: y, left: x }}
    >
      <ul className="py-1">
        <li 
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={onEdit}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-1.414 1.414L12 4.828l1.586-1.242zm-2.172 2.172L3 14.172V17h2.828l8.414-8.414-2.828-2.828z"></path>
          </svg>
          Edit
        </li>
        <li 
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={onDuplicate}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path>
            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path>
          </svg>
          Duplicate
        </li>
        <li 
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 flex items-center"
          onClick={onDelete}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          Delete
        </li>
      </ul>
    </div>
  );
};

export default NodeContextMenu;