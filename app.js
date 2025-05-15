import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { sequelize } from './models/index.js'; // Ensure this path is correct
import helmet from 'helmet';

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// Test DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Sync DB (create tables if they don't exist)
sequelize
  .sync({ alter: false }) // use { force: true } for dev reset (drops and recreates tables)
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error syncing models:', err);
  });

// Base route
app.get('/', (req, res) => {
  res.send('API is running');
});

// API Routes
app.use('/api/auth', authRoutes); // Auth routes like /login
app.use('/api/admin', adminRoutes); // Admin dashboard, user list, etc.
app.use('/api/user', userRoutes); // User dashboard, etc.

// Global Error Handling Middleware
app.use((err, req, res) => {
  console.error('Full error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Server error',
    error: err.message || 'Unknown error',
  });
});

export default app;
