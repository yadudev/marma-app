import express from 'express';
import { getDashboard } from '../controllers/userController.js'; // Optional: separate if you want
import { authenticateToken } from '../middlewares/auth.js';
import { isUser } from '../middlewares/roleCheck.js';

const router = express.Router();

// User Dashboard
router.get('/dashboard', authenticateToken, isUser, getDashboard);

export default router;
