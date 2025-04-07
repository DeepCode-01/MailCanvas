import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { emailSequenceService } from "../services/api";
import NodeConfigPanel from "./NodeConfigPanel";

// Custom node types
const nodeTypes = {
  coldEmail: ColdEmailNode,
  waitDelay: WaitDelayNode,
  leadSource: LeadSourceNode,
};

const EmailFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [sequenceName, setSequenceName] = useState("");
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [sequences, setSequences] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Load sequences on component mount
  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    try {
      const data = await emailSequenceService.getAllSequences();
      setSequences(data);
    } catch (error) {
      console.error("Error loading sequences:", error);
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = {
        x: event.clientX - event.target.getBoundingClientRect().left,
        y: event.clientY - event.target.getBoundingClientRect().top,
      };

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { subject: "", content: "", delay: 0 },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const handleSave = async () => {
    if (!sequenceName) {
      alert("Please enter a sequence name");
      return;
    }

    try {
      const sequenceData = {
        name: sequenceName,
        nodes,
        edges,
      };

      if (selectedSequence) {
        await emailSequenceService.updateSequence(
          selectedSequence._id,
          sequenceData
        );
      } else {
        await emailSequenceService.createSequence(sequenceData);
      }

      await loadSequences();
      alert("Sequence saved successfully!");
    } catch (error) {
      console.error("Error saving sequence:", error);
      alert("Error saving sequence");
    }
  };

  const handleLoad = async (sequence) => {
    setSelectedSequence(sequence);
    setSequenceName(sequence.name);
    setNodes(sequence.nodes);
    setEdges(sequence.edges);
  };

  const handleSchedule = async () => {
    if (!selectedSequence) {
      alert("Please save the sequence first");
      return;
    }

    const recipientEmail = prompt("Enter recipient email:");
    if (!recipientEmail) return;

    try {
      await emailSequenceService.scheduleSequence(selectedSequence._id, {
        startTime: new Date(),
        recipientEmail,
      });
      alert("Sequence scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling sequence:", error);
      alert("Error scheduling sequence");
    }
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const handleNodeUpdate = (updatedNode) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
  };

  return (
    <div className="flex h-full">
      <div className="w-64 p-4 bg-white border-r">
        <div className="mb-4">
          <input
            type="text"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            placeholder="Sequence Name"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-2">
          <button
            onClick={handleSave}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Sequence
          </button>
          <button
            onClick={handleSchedule}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Schedule Sequence
          </button>
        </div>
        <div className="mt-4">
          <h3 className="font-bold mb-2">Saved Sequences</h3>
          <div className="space-y-2">
            {sequences.map((sequence) => (
              <div
                key={sequence._id}
                onClick={() => handleLoad(sequence)}
                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              >
                {sequence.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <NodeConfigPanel
        selectedNode={selectedNode}
        onUpdate={handleNodeUpdate}
      />
    </div>
  );
};

// Custom Node Components
function ColdEmailNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">Cold Email</div>
          <div className="text-sm text-gray-500">
            {data.subject || "No subject"}
          </div>
        </div>
      </div>
    </div>
  );
}

function WaitDelayNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">Wait/Delay</div>
          <div className="text-sm text-gray-500">{data.delay || 0} hours</div>
        </div>
      </div>
    </div>
  );
}

function LeadSourceNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">Lead Source</div>
          <div className="text-sm text-gray-500">
            {data.sourceName || "No source"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailFlow;
