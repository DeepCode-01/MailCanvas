import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import LeadSourceNode from './nodes/LeadSourceNode';
import EmailNode from './nodes/EmailNode';
import DelayNode from './nodes/DelayNode';
import NodeConfigPanel from './NodeConfigPanel';

// Define custom node types
const nodeTypes = {
  leadSource: LeadSourceNode,
  emailNode: EmailNode,
  delayNode: DelayNode
};

const FlowEditor = ({ initialData, onSave, saving }) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedNode, setSelectedNode] = useState(null);

  // Update nodes and edges when initialData changes
  useEffect(() => {
    if (initialData && initialData.nodes && initialData.edges) {
      setNodes(initialData.nodes);
      setEdges(initialData.edges);
      setName(initialData.name || '');
      setDescription(initialData.description || '');
    }
  }, [initialData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      // Check if we have valid data
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Generate a unique node ID
      const id = `${type}_${Date.now()}`;
      
      // Create node based on type
      let newNode;
      
      switch(type) {
        case 'leadSource':
          newNode = {
            id,
            type,
            position,
            data: { 
              label: 'Lead Source',
              sources: []
            },
          };
          break;
        case 'emailNode':
          newNode = {
            id,
            type,
            position,
            data: { 
              label: 'Email',
              subject: '',
              body: '',
              recipients: []
            },
          };
          break;
        case 'delayNode':
          newNode = {
            id,
            type,
            position,
            data: { 
              label: 'Delay',
              delayType: 'fixed',
              delayValue: 1,
              delayUnit: 'days'
            },
          };
          break;
        default:
          return;
      }
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onSaveFlow = () => {
    if (!name.trim()) {
      alert('Please enter a sequence name');
      return;
    }
    
    onSave({
      name,
      description,
      nodes,
      edges
    });
  };

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
      setEdges((edges) => edges.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-screen -mt-16 pt-16">
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Sequence Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter sequence name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter sequence description"
            rows="2"
          ></textarea>
        </div>
      </div>
      
      <div className="flex-grow flex">
        <ReactFlowProvider>
          <div className="flex-grow h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background variant="dots" gap={12} size={1} />
              <Controls />
              <Panel position="top-right">
                <button
                  onClick={onSaveFlow}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Sequence'}
                </button>
              </Panel>
            </ReactFlow>
          </div>
          <Sidebar />
          {selectedNode && (
            <NodeConfigPanel 
              node={selectedNode} 
              updateNodeData={updateNodeData} 
              onDeleteNode={handleDeleteNode}
            />
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowEditor;