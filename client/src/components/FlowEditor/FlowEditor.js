
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import 'reactflow/dist/style.css';
import ColdEmailNode from './nodes/ColdEmailNode';
import WaitDelayNode from './nodes/WaitDelayNode';
import LeadSourceNode from './nodes/LeadSourceNode';
import { saveFlow, loadFlow } from '../../api/flowApi';

// Custom node types
const nodeTypes = {
  coldEmail: ColdEmailNode,
  waitDelay: WaitDelayNode,
  leadSource: LeadSourceNode,
};

const FlowEditor = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [flowName, setFlowName] = useState('New Email Sequence');
  const [isSaving, setIsSaving] = useState(false);

  // Connect nodes when edges are created
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Drag and drop functionality for adding new nodes
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Default data for each node type
      let data = { label: `${type} node` };
      
      if (type === 'coldEmail') {
        data = { 
          subject: 'Email Subject',
          body: 'Email body content goes here...',
          to: '',
        };
      } else if (type === 'waitDelay') {
        data = { delayTime: 24, delayUnit: 'hours' };
      } else if (type === 'leadSource') {
        data = { sourceName: 'New Leads' };
      }

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Save flow to backend
  const handleSave = async () => {
    if (!reactFlowInstance) return;
    
    setIsSaving(true);
    
    const flowData = {
      name: flowName,
      nodes: nodes,
      edges: edges,
    };
    
    try {
      await saveFlow(flowData);
      alert('Flow saved successfully!');
    } catch (error) {
      console.error('Error saving flow:', error);
      alert('Error saving flow');
    } finally {
      setIsSaving(false);
    }
  };

  // Load a saved flow
  const loadSavedFlow = async (id) => {
    try {
      const flow = await loadFlow(id);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setFlowName(flow.name);
    } catch (error) {
      console.error('Error loading flow:', error);
      alert('Error loading flow');
    }
  };

  return (
    <div className="flow-editor-container" style={{ height: '80vh', width: '100%' }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
            
            <Panel position="top-left" className="flow-panel">
              <h3>{flowName}</h3>
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="Flow Name"
              />
              <button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Flow'}
              </button>
            </Panel>
            
            <Panel position="top-right" className="node-palette">
              <div className="node-palette-header">Node Types</div>
              <div
                className="dndnode"
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', 'coldEmail');
                }}
                draggable
              >
                Cold Email
              </div>
              <div
                className="dndnode"
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', 'waitDelay');
                }}
                draggable
              >
                Wait/Delay
              </div>
              <div
                className="dndnode"
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', 'leadSource');
                }}
                draggable
              >
                Lead Source
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowEditor;