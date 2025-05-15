import express from 'express';
import { login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validateRequest, validationSchemas } from '../middlewares/validation.js';

const router = express.Router();

// Auth Routes
router.post('/login', validateRequest(validationSchemas.login), login);
router.post('/forgot-password', validateRequest(validationSchemas.forgotPassword), forgotPassword);
router.post(
  '/reset-password/:token',
  validateRequest(validationSchemas.resetPassword),
  resetPassword
);

export default router;
