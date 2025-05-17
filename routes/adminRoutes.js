import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/roleCheck.js';

import userRoutes from './admin/userRoutes.js';
import therapistRoutes from './admin/therapistRoutes.js';
import bookingRoutes from './admin/bookingRoutes.js';
import videoRoutes from './admin/videoRoutes.js';
import otpRoutes from './admin/otpRoutes.js';
import { getDashboard } from '../controllers/adminController.js';

const router = express.Router();

// Apply auth and admin role middleware to all admin routes
router.use(authenticateToken, isAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Modular Routes
router.use('/users', userRoutes);
router.use('/therapists', therapistRoutes);
router.use('/bookings', bookingRoutes);
router.use('/learner', videoRoutes);
router.use('/otp', otpRoutes);

export default router;
