import mongoose from 'mongoose';

const flowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nodes: {
      type: Array,
      default: [],
    },
    edges: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    lastEdited: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Flow = mongoose.model('Flow', flowSchema);

export default Flow;