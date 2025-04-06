import express from 'express';
const router = express.Router();
import flowController from '../controllers/flow.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

// Protect all routes in this router
router.use(authMiddleware);

// Create a new flow
router.post('/', flowController.createFlow);

// Get all flows for current user
router.get('/', flowController.getFlows);

// Get a specific flow by ID
router.get('/:id', flowController.getFlowById);

// Update a flow
router.put('/:id', flowController.updateFlow);

// Delete a flow
router.delete('/:id', flowController.deleteFlow);

export default router