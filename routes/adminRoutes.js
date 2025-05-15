import express from 'express';
import {
  getDashboard,
  getUserList,
  changeUserStatus,
  deleteUser,
} from '../controllers/adminController.js';

import {
  addTherapist,
  getTherapists,
  getTherapistById,
  updateTherapist,
  deleteTherapist,
  updateTherapistStatus,
  getTherapistStats,
} from '../controllers/therapistController.js';

import { authenticateToken, isAdmin } from '../middlewares/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer config for therapist file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/therapists/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Admin Dashboard Route
router.get('/dashboard', authenticateToken, isAdmin, getDashboard);

// User Management Routes
router.get('/users', authenticateToken, isAdmin, getUserList);
router.patch('/users/:id/status', authenticateToken, isAdmin, changeUserStatus);
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

// Therapist Management Routes
router.post('/therapists', authenticateToken, isAdmin, upload.single('file'), addTherapist);
router.get('/therapists', authenticateToken, isAdmin, getTherapists);
router.get('/therapists/stats', authenticateToken, isAdmin, getTherapistStats);
router.get('/therapists/:id', authenticateToken, isAdmin, getTherapistById);
router.put('/therapists/:id', authenticateToken, isAdmin, upload.single('file'), updateTherapist);
router.delete('/therapists/:id', authenticateToken, isAdmin, deleteTherapist);
router.patch('/therapists/:id/status', authenticateToken, isAdmin, updateTherapistStatus);

export default router;
