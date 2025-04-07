import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node components
const ColdEmailNode = ({ data }) => {
  return (
    <div className="p-3 rounded-md border-2 border-blue-500 bg-white">
      <h3 className="font-bold text-blue-500">Cold Email</h3>
      <div className="mt-2">
        <p className="text-sm">Subject: {data.subject || "No subject"}</p>
        <p className="text-sm mt-1 truncate">
          Message:{" "}
          {data.message ? `${data.message.substring(0, 30)}...` : "No message"}
        </p>
      </div>
    </div>
  );
};

const DelayNode = ({ data }) => {
  return (
    <div className="p-3 rounded-md border-2 border-yellow-500 bg-white">
      <h3 className="font-bold text-yellow-500">Delay</h3>
      <div className="mt-2">
        <p className="text-sm">
          Wait for: {data.delay || "1"} {data.unit || "day(s)"}
        </p>
      </div>
    </div>
  );
};

const LeadSourceNode = ({ data }) => {
  return (
    <div className="p-3 rounded-md border-2 border-green-500 bg-white">
      <h3 className="font-bold text-green-500">Lead Source</h3>
      <div className="mt-2">
        <p className="text-sm">Source: {data.source || "Not specified"}</p>
      </div>
    </div>
  );
};

// Node types mapping
const nodeTypes = {
  coldEmail: ColdEmailNode,
  delay: DelayNode,
  leadSource: LeadSourceNode,
};

// Initial nodes
const initialNodes = [
  {
    id: "start",
    position: { x: 250, y: 5 },
    data: { label: "Start" },
    type: "input",
  },
];

const SequenceBuilder = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeName, setNodeName] = useState("");
  const [selectedNodeType, setSelectedNodeType] = useState("coldEmail");
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    delay: "1",
    unit: "day",
    source: "",
  });
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightedArea, setHighlightedArea] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sequenceName, setSequenceName] = useState("");

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to the Email Sequence Builder!",
      content:
        "This tool helps you create automated email sequences visually. Let's learn how to use it.",
      image: null,
    },
    {
      title: "Adding Nodes",
      content:
        "Start by selecting a node type from the sidebar, fill in the details, and click 'Add Node'.",
      image: null,
    },
    {
      title: "Connecting Nodes",
      content:
        "Click and drag from one node's handle to another to create connections between steps.",
      image: null,
    },
    {
      title: "Arranging Your Sequence",
      content:
        "Drag nodes around to organize your sequence in a way that makes sense to you.",
      image: null,
    },
    {
      title: "Saving Your Work",
      content:
        "When you're done, click 'Save Sequence' to store your workflow for later use.",
      image: null,
    },
  ];

  // Close tutorial
  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("sequenceBuilderTutorialSeen", "true");
  };

  // Check if tutorial has been seen before
  useEffect(() => {
    const tutorialSeen = localStorage.getItem("sequenceBuilderTutorialSeen");
    if (tutorialSeen === "true") {
      setShowTutorial(false);
    }
  }, []);

  // Move to next tutorial step
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  // Move to previous tutorial step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form data change
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Connect nodes with edges
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Set up ReactFlow instance
  const onInit = useCallback(
    (reactFlowInstance) => setReactFlowInstance(reactFlowInstance),
    []
  );

  // Handle drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Helper function to show success messages
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Enhanced addNode with feedback
  const addNode = () => {
    if (!reactFlowInstance) return;

    // Generate random position with offset
    const position = {
      x: Math.random() * 400,
      y: Math.random() * 400 + 50,
    };

    let nodeData = { label: nodeName || "New Node" };

    // Add specific data based on node type
    switch (selectedNodeType) {
      case "coldEmail":
        nodeData = {
          ...nodeData,
          subject: formData.subject,
          message: formData.message,
        };
        break;
      case "delay":
        nodeData = {
          ...nodeData,
          delay: formData.delay,
          unit: formData.unit,
        };
        break;
      case "leadSource":
        nodeData = {
          ...nodeData,
          source: formData.source,
        };
        break;
      default:
        break;
    }

    // Create the new node
    const newNode = {
      id: `node_${nodes.length + 1}`,
      type: selectedNodeType,
      position,
      data: nodeData,
    };

    // Add the node to the flow
    setNodes((nds) => nds.concat(newNode));
    setNodeName("");

    // Show success message
    showSuccess(`Added new ${selectedNodeType} node`);

    // If this is the second node, highlight connection points
    if (nodes.length === 1) {
      setHighlightedArea("connections");
      setTimeout(() => {
        setHighlightedArea(null);
      }, 5000);
    }
  };

  // Enhanced saveSequence with feedback
  const saveSequence = async () => {
    if (!reactFlowInstance) return;

    try {
      // Make sure we have nodes before saving
      if (nodes.length <= 1) {
        setHighlightedArea("addNodes");
        setTimeout(() => {
          setHighlightedArea(null);
        }, 3000);
        return;
      }

      // Get the current flow data
      const flow = reactFlowInstance.toObject();

      // Prepare sequence data
      const sequenceData = {
        name: sequenceName || `Sequence ${new Date().toLocaleDateString()}`,
        nodes: flow.nodes,
        edges: flow.edges,
      };

      // Send data to API
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("https://mail-backend-26n9.onrender.com/api/sequences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sequenceData),
      });

      if (!response.ok) {
        throw new Error("Failed to save sequence");
      }

      const savedSequence = await response.json();

      // Schedule the emails based on the sequence flow
      const recipientEmail = prompt(
        "Enter recipient email to schedule this sequence:"
      );
      if (recipientEmail) {
        const scheduleResponse = await fetch(
          `https://mail-backend-26n9.onrender.com/api/sequences/${savedSequence._id}/schedule`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              startTime: new Date().toISOString(),
              recipientEmail,
            }),
          }
        );

        if (!scheduleResponse.ok) {
          throw new Error("Failed to schedule sequence");
        }
      }

      showSuccess("Sequence saved and scheduled successfully");
    } catch (error) {
      console.error("Error saving sequence:", error);
      setSuccessMessage(`Error: ${error.message}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  // Check screen size on component mount and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Check initially
    checkIsMobile();

    // Set up event listener
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Help topics for interactive guide
  const helpTopics = [
    {
      title: "Adding Nodes",
      content:
        "Select a node type, fill in details, and click Add Node to create a new step in your sequence.",
    },
    {
      title: "Connecting Nodes",
      content:
        "To establish the flow order, connect nodes by clicking and dragging from one node's handle to another node's handle.",
    },
    {
      title: "Node Types",
      content:
        "Cold Email: Send messages to leads. Delay: Wait between steps. Lead Source: Define where leads come from.",
    },
    {
      title: "Editing & Moving",
      content:
        "Click a node to select it. Drag to reposition. Customize your sequence layout for clarity.",
    },
    {
      title: "Saving Your Work",
      content:
        "When your sequence is ready, click 'Save Sequence' to store it. You need at least two connected nodes.",
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className=" text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="bg-blue-800 hover:bg-blue-800 p-2 rounded text-sm"
            title="Get Help"
          >
            ?
          </button>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="md:hidden bg-blue-700 p-2 rounded"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* Success Message Toast */}
      {successMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-3 rounded-md shadow-lg ${
            successMessage.type === "error"
              ? "bg-red-100 border border-red-300 text-red-800"
              : "bg-green-100 border border-green-300 text-green-800"
          }`}
        >
          {typeof successMessage === "string"
            ? successMessage
            : successMessage.text}
        </div>
      )}

      {/* Interactive Help Overlay */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sequence Builder Help</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-96">
              {helpTopics.map((topic, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-lg text-blue-600">
                    {topic.title}
                  </h3>
                  <p className="mt-1 text-gray-700">{topic.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Popup */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {tutorialSteps[currentStep].title}
              </h2>
              <button
                onClick={closeTutorial}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="mb-4">{tutorialSteps[currentStep].content}</p>

            {tutorialSteps[currentStep].image && (
              <img
                src={tutorialSteps[currentStep].image}
                alt={`Step ${currentStep + 1}`}
                className="mb-4 rounded border"
              />
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded ${
                  currentStep === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>

              <button
                onClick={nextStep}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {currentStep < tutorialSteps.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transform transition-transform duration-300 ease-in-out
          w-64 bg-gray-100 p-4 border-r absolute md:relative z-10 h-full overflow-y-auto`}
        >
          <h2 className="text-lg font-semibold mb-4">Add Node</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Node Type</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedNodeType}
              onChange={(e) => setSelectedNodeType(e.target.value)}
            >
              <option value="coldEmail">Cold Email</option>
              <option value="delay">Wait/Delay</option>
              <option value="leadSource">Lead Source</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Node Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Enter node name"
            />
            {nodeName === "" && (
              <p className="text-xs text-gray-500 mt-1">
                A name will help identify this node in your sequence
              </p>
            )}
          </div>

          {/* Dynamic form based on selected node type */}
          {selectedNodeType === "coldEmail" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full p-2 border rounded"
                  value={formData.subject}
                  onChange={handleFormChange}
                  placeholder="Email subject"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  className="w-full p-2 border rounded"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Email content"
                  rows="4"
                />
              </div>
            </>
          )}

          {selectedNodeType === "delay" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Delay</label>
                <div className="flex">
                  <input
                    type="number"
                    name="delay"
                    className="w-1/2 p-2 border rounded-l"
                    value={formData.delay}
                    onChange={handleFormChange}
                    min="1"
                  />
                  <select
                    name="unit"
                    className="w-1/2 p-2 border border-l-0 rounded-r"
                    value={formData.unit}
                    onChange={handleFormChange}
                  >
                    <option value="hour">Hour(s)</option>
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {selectedNodeType === "leadSource" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Source</label>
                <input
                  type="text"
                  name="source"
                  className="w-full p-2 border rounded"
                  value={formData.source}
                  onChange={handleFormChange}
                  placeholder="Lead source"
                />
              </div>
            </>
          )}

          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={addNode}
            disabled={
              selectedNodeType === "coldEmail" &&
              formData.subject === "" &&
              formData.message === ""
            }
          >
            Add Node
          </button>

          <button
            className="w-full mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
            onClick={saveSequence}
            disabled={nodes.length <= 1 || edges.length === 0}
          >
            Save Sequence
          </button>

          <button
            className="w-full mt-4 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            onClick={() => setShowTutorial(true)}
          >
            Show Tutorial
          </button>

          {/* Quick help section */}
          <div className="mt-6 p-3 bg-gray-200 rounded">
            <h3 className="font-semibold text-sm">Quick Tips:</h3>
            <ul className="text-xs mt-2 space-y-1">
              <li>• Create email nodes for each message</li>
              <li>• Add delay nodes to wait between emails</li>
              <li>• Connect nodes by dragging between points</li>
              <li>• Rearrange nodes by dragging them</li>
            </ul>
          </div>
        </div>

        {/* Overlay to close sidebar on mobile when clicking outside */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-0"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* ReactFlow Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={(params) => {
                onConnect(params);
                showSuccess("Connected nodes successfully!");
              }}
              onInit={onInit}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
              className={
                highlightedArea === "connections" ? "connection-highlight" : ""
              }
            >
              <Controls />
              <Background color="#aaa" gap={16} />
              <Panel
                position="top-right"
                className="bg-white p-2 rounded shadow"
              >
                <div className="text-sm">
                  <p>
                    <strong>Tip:</strong> Connect nodes by dragging between
                    connection points
                  </p>
                  <p className="mt-1">
                    <strong>Tip:</strong> Drag nodes to reposition
                  </p>
                </div>
              </Panel>
              {nodes.length <= 1 && (
                <Panel
                  position="top-center"
                  className="bg-blue-100 p-3 rounded shadow border border-blue-300"
                >
                  <div className="text-center">
                    <p className="font-semibold">
                      Start building your sequence!
                    </p>
                    <p className="text-sm mt-1">
                      Add nodes from the sidebar and connect them together
                    </p>
                  </div>
                </Panel>
              )}
              {highlightedArea === "connections" && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    <p className="font-bold">Connect your nodes!</p>
                    <p>
                      Drag from one node's handle to another to create a
                      connection
                    </p>
                  </div>
                </div>
              )}
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* Custom CSS for highlighting connection points */}
      <style jsx>{`
        .connection-highlight :global(.react-flow__handle) {
          animation: pulse 1.5s infinite;
          box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
          }

          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
          }

          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default SequenceBuilder;
