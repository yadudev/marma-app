import express from 'express';
import { getDashboard } from '../controllers/userController.js'; // Optional: separate if you want
import { authenticateToken, isUser } from '../middlewares/auth.js';

const router = express.Router();

// User Dashboard
router.get('/dashboard', authenticateToken, isUser, getDashboard);

export default router;
