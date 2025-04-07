const mongoose = require("mongoose");

const nodeDataSchema = new mongoose.Schema(
  {
    label: String,
    subject: String,
    message: String,
    delay: String,
    unit: String,
    source: String,
  },
  { _id: false }
);

const nodeSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    position: {
      x: Number,
      y: Number,
    },
    data: nodeDataSchema,
  },
  { _id: false }
);

const edgeSchema = new mongoose.Schema(
  {
    id: String,
    source: String,
    target: String,
    type: String,
  },
  { _id: false }
);

const emailSequenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("EmailSequence", emailSequenceSchema);
