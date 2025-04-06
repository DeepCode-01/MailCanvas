import express from 'express';
const router = express.Router();
import emailController from '../controllers/email.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

// Protect all routes in this router
router.use(authMiddleware);

// Schedule a new email
router.post('/schedule', emailController.scheduleNewEmail);

// Get all scheduled emails
router.get('/scheduled', emailController.getScheduledEmails);

// Get all sent emails
router.get('/sent', emailController.getSentEmails);

// Cancel a scheduled email
router.delete('/scheduled/:id', emailController.cancelScheduledEmail);

export default router