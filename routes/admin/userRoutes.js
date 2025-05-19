import express from 'express';
import { getUserList, changeUserStatus, deleteUser } from '../../controllers/adminController.js';
import { authenticateToken } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/roleCheck.js';

const router = express.Router();

router.get('/', getUserList);
router.patch('/:id/status', authenticateToken, isAdmin, changeUserStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

export default router;
