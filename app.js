const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const { sequelize } = require('./models/index.js'); // Ensure this path is correct

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
  .sync({ alter: false })
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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Global Error Handling Middleware
app.use((err, req, res) => {
  console.error('Full error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Server error',
    error: err.message || 'Unknown error',
  });
});

module.exports = app;
