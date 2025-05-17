import express from 'express';
import { getOtpLogs, getOtpStats } from '../../controllers/adminController.js';

const router = express.Router();

router.get('/logs', getOtpLogs);
router.get('/stats', getOtpStats);

export default router;
