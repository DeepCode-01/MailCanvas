import React from 'react';

const FlowControls = ({ 
  onAddLeadSource, 
  onAddEmail, 
  onAddDelay, 
  onSave, 
  onClear,
  isSaving 
}) => {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center text-sm"
            onClick={onAddLeadSource}
          >
            <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Lead Source
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center text-sm"
            onClick={onAddEmail}
          >
            <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Email
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded flex items-center text-sm"
            onClick={onAddDelay}
          >
            <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Delay
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded flex items-center text-sm"
            onClick={onClear}
          >
            <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear
          </button>
          <button
            className={`bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded flex items-center text-sm ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
            )}
            Save Flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowControls;