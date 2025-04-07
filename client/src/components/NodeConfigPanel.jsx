import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NodeConfigPanel = ({
  selectedNodeType,
  setSelectedNodeType,
  formData,
  setFormData,
  nodeName,
  setNodeName,
  addNode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Animation variants
  const panelVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form data when node type changes
  useEffect(() => {
    if (selectedNodeType === "coldEmail") {
      setFormData((prev) => ({
        ...prev,
        subject: prev.subject || "",
        message: prev.message || "",
      }));
    } else if (selectedNodeType === "delay") {
      setFormData((prev) => ({
        ...prev,
        delay: prev.delay || "1",
        unit: prev.unit || "day",
      }));
    } else if (selectedNodeType === "leadSource") {
      setFormData((prev) => ({
        ...prev,
        source: prev.source || "",
      }));
    }
  }, [selectedNodeType, setFormData]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-0 top-1/4 bg-white shadow-xl rounded-l-lg w-80 z-10 overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
        >
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
            <h3 className="font-bold">Node Configuration</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-full hover:bg-indigo-500 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              )}
            </motion.button>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Type
              </label>
              <select
                value={selectedNodeType}
                onChange={(e) => setSelectedNodeType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="coldEmail">Cold Email</option>
                <option value="delay">Wait/Delay</option>
                <option value="leadSource">Lead Source</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Name (Optional)
              </label>
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Enter node name"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {selectedNodeType === "coldEmail" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder="Enter email subject"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Enter email message"
                    rows="4"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  ></textarea>
                </div>
              </motion.div>
            )}

            {selectedNodeType === "delay" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delay Duration
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="delay"
                      value={formData.delay}
                      onChange={handleFormChange}
                      min="1"
                      className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleFormChange}
                      className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="minute">Minute(s)</option>
                      <option value="hour">Hour(s)</option>
                      <option value="day">Day(s)</option>
                      <option value="week">Week(s)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedNodeType === "leadSource" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Source
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleFormChange}
                    placeholder="e.g., Website, LinkedIn, Referral"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              onClick={addNode}
            >
              Add Node
            </motion.button>
          </div>
        </motion.div>
      )}

      {!isOpen && (
        <motion.button
          className="fixed right-0 top-1/4 bg-indigo-600 text-white p-3 rounded-l-lg shadow-lg z-10"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default NodeConfigPanel;
