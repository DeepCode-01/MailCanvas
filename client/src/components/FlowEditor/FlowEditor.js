// src/components/FlowEditor/FlowEditor.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

import nodeTypes from './nodeTypes';
import FlowControls from './FlowControls';
import NodeContextMenu from './NodeContextMenu';
import { createFlow, getFlowById, updateFlow } from '../../api/flowService';

const initialNodes = [];
const initialEdges = [];

const FlowEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [isSaving, setIsSaving] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  // Load flow data if ID is provided
  useEffect(() => {
    if (id && id !== 'new') {
      const fetchFlow = async () => {
        try {
          const flowData = await getFlowById(id);
          if (flowData) {
            setFlowName(flowData.name);
            if (flowData.nodes) setNodes(flowData.nodes);
            if (flowData.edges) setEdges(flowData.edges);
          }
        } catch (error) {
          toast.error('Error loading flow data');
          console.error('Error loading flow:', error);
        }
      };
      fetchFlow();
    }
  }, [id, setNodes, setEdges]);

  // Handle node connections
  const onConnect = useCallback((params) => {
    // Create edge with animated style and arrow marker
    const newEdge = {
      ...params,
      animated: true,
      style: { stroke: '#555' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#555',
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  // Node data change handler
  const onNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Add node handler
  const addNode = useCallback(
    (type, position) => {
      const id = uuidv4();
      const newNode = {
        id,
        type,
        position: position || {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        data: {
          onChange: (data) => onNodeDataChange(id, data),
        },
      };

      // Add specific data based on node type
      if (type === 'email') {
        newNode.data.subject = '';
        newNode.data.body = '';
      } else if (type === 'delay') {
        newNode.data.value = 1;
        newNode.data.unit = 'days';
      } else if (type === 'leadSource') {
        newNode.data.name = 'Lead Source';
        newNode.data.description = '';
        newNode.data.sourceType = 'manual';
      }

      setNodes((nds) => nds.concat(newNode));
      return newNode;
    },
    [setNodes, onNodeDataChange]
  );

  // Node context menu handlers
  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      const boundingRect = reactFlowWrapper.current.getBoundingClientRect();
      setContextMenu({
        id: node.id,
        type: node.type,
        x: event.clientX - boundingRect.left,
        y: event.clientY - boundingRect.top,
      });
    },
    [reactFlowWrapper]
  );

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  const onNodeDelete = useCallback(() => {
    if (contextMenu) {
      setNodes((nds) => nds.filter((node) => node.id !== contextMenu.id));
      setEdges((eds) => eds.filter(
        (edge) => edge.source !== contextMenu.id && edge.target !== contextMenu.id
      ));
      setContextMenu(null);
    }
  }, [contextMenu, setNodes, setEdges]);

  const onNodeDuplicate = useCallback(() => {
    if (contextMenu) {
      const nodeToClone = nodes.find((node) => node.id === contextMenu.id);
      if (nodeToClone) {
        const newNodeData = { ...nodeToClone.data };
        delete newNodeData.onChange;
        
        const newNode = addNode(nodeToClone.type, {
          x: nodeToClone.position.x + 50,
          y: nodeToClone.position.y + 50,
        });
        
        onNodeDataChange(newNode.id, newNodeData);
      }
      setContextMenu(null);
    }
  }, [contextMenu, nodes, addNode, onNodeDataChange]);

  // Save flow
  const handleSaveFlow = async () => {
    setIsSaving(true);
    try {
      const flowData = {
        name: flowName,
        nodes,
        edges,
      };

      let response;
      if (id && id !== 'new') {
        response = await updateFlow(id, flowData);
      } else {
        response = await createFlow(flowData);
        navigate(`/flows/${response.id}`);
      }

      toast.success('Flow saved successfully');
    } catch (error) {
      toast.error('Error saving flow');
      console.error('Error saving flow:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Clear flow
  const handleClearFlow = () => {
    if (window.confirm('Are you sure you want to clear the flow? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
    }
  };

  // Component control shortcuts
  const addLeadSourceNode = () => addNode('leadSource');
  const addEmailNode = () => addNode('email');
  const addDelayNode = () => addNode('delay');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-white border-b flex items-center">
        <input
          type="text"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="flex-grow text-xl font-semibold px-2 py-1 border-b-2 border-transparent focus:border-indigo-500 focus:outline-none"
          placeholder="Flow Name"
        />
      </div>
      
      <FlowControls
        onAddLeadSource={addLeadSourceNode}
        onAddEmail={addEmailNode}
        onAddDelay={addDelayNode}
        onSave={handleSaveFlow}
        onClear={handleClearFlow}
        isSaving={isSaving}
      />
      
      <div className="flex-grow" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
        >
          <Controls />
          <Background color="#aaa" gap={16} />
          
          {contextMenu && (
            <NodeContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onDelete={onNodeDelete}
              onDuplicate={onNodeDuplicate}
              onEdit={() => {/* Implement if needed */}}
              onClose={() => setContextMenu(null)}
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;