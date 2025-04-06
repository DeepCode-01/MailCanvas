import express from "express"
import mongoose from "mongoose";
import  cors from 'cors';
import  morgan from'morgan';
import  helmet from'helmet';
import  compression from'compression';
import { config } from "dotenv";

config({path:"./config/config.env"})

// Import routes
import authRoutes from './routes/auth.routes.js';
import flowRoutes from './routes/flow.routes.js';
import emailRoutes from './routes/email.routes.js';

// Import agenda service
import startAgenda  from './services/agenda/index.js';

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start Agenda job scheduler after DB connection
    startAgenda();
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/flows', flowRoutes);
app.use('/api/emails', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

export default app

