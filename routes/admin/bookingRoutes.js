import express from 'express';
import {
  getBookingStats,
  getBookingList,
  getBookingById,
  changeBookingStatus,
  cancelBooking,
} from '../../controllers/bookingController.js';

const router = express.Router();

router.get('/stats', getBookingStats);
router.get('/', getBookingList);
router.get('/:id', getBookingById);
router.patch('/:id/status', changeBookingStatus);
router.patch('/:id/cancel', cancelBooking);

export default router;
