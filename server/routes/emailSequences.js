const express = require("express");
const router = express.Router();
const EmailSequence = require("../models/EmailSequence");
const Agenda = require("agenda");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Agenda
const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: "agendaJobs",
  },
});

// Get all sequences for the current user
router.get("/", async (req, res) => {
  try {
    const sequences = await EmailSequence.find({ userId: req.user.id });
    res.json(sequences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new sequence
router.post("/", async (req, res) => {
  try {
    // Ensure nodes and edges are arrays
    const nodes = Array.isArray(req.body.nodes) ? req.body.nodes : [];
    const edges = Array.isArray(req.body.edges) ? req.body.edges : [];

    const sequence = new EmailSequence({
      name: req.body.name,
      nodes,
      edges,
      userId: req.user.id,
    });

    const newSequence = await sequence.save();
    res.status(201).json(newSequence);
  } catch (error) {
    console.error("Error creating sequence:", error);
    res.status(400).json({ message: error.message });
  }
});

// Schedule a sequence
router.post("/:id/schedule", async (req, res) => {
  try {
    const sequence = await EmailSequence.findById(req.params.id);
    if (!sequence) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    const { startTime, recipientEmail } = req.body;

    if (!startTime || !recipientEmail) {
      return res
        .status(400)
        .json({ message: "Start time and recipient email are required" });
    }

    // Create a map of nodes for easier access
    const nodesMap = new Map();
    sequence.nodes.forEach((node) => {
      nodesMap.set(node.id, node);
    });

    // Find all lead source nodes - these are our starting points
    const startNodes = sequence.nodes.filter(
      (node) => node.type === "leadSource" || node.id === "start"
    );

    if (startNodes.length === 0) {
      return res
        .status(400)
        .json({ message: "Sequence must have at least one starting node" });
    }

    // For each start node, follow the path and schedule emails
    for (const startNode of startNodes) {
      let currentDelayHours = 0;
      let nodesToProcess = [
        {
          nodeId: startNode.id,
          delayHours: 0,
        },
      ];

      // Keep track of processed nodes to avoid cycles
      const processedNodes = new Set();

      // Process all nodes in the sequence
      while (nodesToProcess.length > 0) {
        const { nodeId, delayHours } = nodesToProcess.shift();

        // Skip if already processed to avoid infinite loops
        if (processedNodes.has(nodeId)) continue;
        processedNodes.add(nodeId);

        const currentNode = nodesMap.get(nodeId);
        if (!currentNode) continue;

        // Handle node based on its type
        if (currentNode.type === "coldEmail") {
          // Schedule this email with accumulated delay
          const emailTime = new Date(startTime);
          emailTime.setHours(emailTime.getHours() + delayHours);

          // Schedule the email
          await agenda.schedule(emailTime, "send email", {
            to: recipientEmail,
            subject: currentNode.data.subject || "No Subject",
            text: currentNode.data.message || "No Content",
          });

          console.log(
            `Scheduled email "${
              currentNode.data.subject
            }" for ${emailTime.toISOString()}`
          );
        } else if (currentNode.type === "delay") {
          // Calculate delay in hours based on the unit
          let additionalDelay = parseInt(currentNode.data.delay || "1");

          // Convert to hours based on unit
          switch (currentNode.data.unit) {
            case "minute":
              additionalDelay = additionalDelay / 60;
              break;
            case "hour":
              // Already in hours
              break;
            case "day":
              additionalDelay = additionalDelay * 24;
              break;
            case "week":
              additionalDelay = additionalDelay * 24 * 7;
              break;
            default:
              additionalDelay = additionalDelay * 24; // Default to days
          }

          // Update the current delay
          currentDelayHours = delayHours + additionalDelay;
        }

        // Find all edges from the current node
        const outgoingEdges = sequence.edges.filter(
          (edge) => edge.source === nodeId
        );

        // Add target nodes to the processing queue
        for (const edge of outgoingEdges) {
          nodesToProcess.push({
            nodeId: edge.target,
            delayHours: currentDelayHours,
          });
        }
      }
    }

    res.json({ message: "Sequence scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling sequence:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a sequence
router.patch("/:id", async (req, res) => {
  try {
    const sequence = await EmailSequence.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!sequence) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    if (req.body.name) sequence.name = req.body.name;
    if (req.body.nodes) sequence.nodes = req.body.nodes;
    if (req.body.edges) sequence.edges = req.body.edges;
    sequence.updatedAt = Date.now();

    const updatedSequence = await sequence.save();
    res.json(updatedSequence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a sequence
router.delete("/:id", async (req, res) => {
  try {
    const sequence = await EmailSequence.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!sequence) {
      return res.status(404).json({ message: "Sequence not found" });
    }

    await EmailSequence.deleteOne({ _id: req.params.id });
    res.json({ message: "Sequence deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
