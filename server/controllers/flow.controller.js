import Flow from '../models/flow.model.js';

const createFlow = async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Flow name is required' });
    }
    
    const newFlow = new Flow({
      name,
      nodes: nodes || [],
      edges: edges || [],
      user: req.user._id
    });
    
    await newFlow.save();
    
    return res.status(201).json({
      message: 'Flow created successfully',
      flow: newFlow
    });
  } catch (error) {
    console.error('Error creating flow:', error);
    return res.status(500).json({ message: 'Error creating flow' });
  }
};

const getFlows = async (req, res) => {
  try {
    const flows = await Flow.find({ user: req.user._id })
      .sort({ lastEdited: -1 });
    
    return res.status(200).json(flows);
  } catch (error) {
    console.error('Error fetching flows:', error);
    return res.status(500).json({ message: 'Error fetching flows' });
  }
};

const getFlowById = async (req, res) => {
  try {
    const flow = await Flow.findOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!flow) {
      return res.status(404).json({ message: 'Flow not found' });
    }
    
    return res.status(200).json(flow);
  } catch (error) {
    console.error('Error fetching flow:', error);
    return res.status(500).json({ message: 'Error fetching flow' });
  }
};

const updateFlow = async (req, res) => {
  try {
    const { name, nodes, edges, isActive } = req.body;
    
    const updatedFlow = await Flow.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        $set: { 
          name: name,
          nodes: nodes,
          edges: edges,
          isActive: isActive !== undefined ? isActive : undefined,
          lastEdited: new Date()
        } 
      },
      { new: true }
    );
    
    if (!updatedFlow) {
      return res.status(404).json({ message: 'Flow not found' });
    }
    
    return res.status(200).json({
      message: 'Flow updated successfully',
      flow: updatedFlow
    });
  } catch (error) {
    console.error('Error updating flow:', error);
    return res.status(500).json({ message: 'Error updating flow' });
  }
};

const deleteFlow = async (req, res) => {
  try {
    const result = await Flow.deleteOne({ 
      _id: req.params.id,
      user: req.user._id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Flow not found' });
    }
    
    return res.status(200).json({ message: 'Flow deleted successfully' });
  } catch (error) {
    console.error('Error deleting flow:', error);
    return res.status(500).json({ message: 'Error deleting flow' });
  }
};

export default {createFlow, deleteFlow, updateFlow, getFlowById, getFlows}