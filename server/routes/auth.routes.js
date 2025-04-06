import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get user profile (protected route)
router.get('/profile', authMiddleware, authController.getProfile);

export default router

