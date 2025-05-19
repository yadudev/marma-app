import express from 'express';
import {
  getBookingStats,
  getBookingList,
  getBookingById,
  changeBookingStatus,
  cancelBooking,
} from '../../controllers/bookingController.js';
import { authenticateToken } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/roleCheck.js';

const router = express.Router();

router.get('/stats', getBookingStats);
router.get('/', getBookingList);
router.get('/:id', getBookingById);
router.patch('/:id/status', authenticateToken, isAdmin, changeBookingStatus);
router.patch('/:id/cancel', authenticateToken, isAdmin, cancelBooking);

export default router;
