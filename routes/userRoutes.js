import express from 'express';
import { getDashboard } from '../controllers/userController.js';

const router = express.Router();

// User Dashboard
router.get('/dashboard', getDashboard);

export default router;
