import express from 'express';
import { getUserList, changeUserStatus, deleteUser } from '../../controllers/adminController.js';

const router = express.Router();

router.get('/', getUserList);
router.patch('/:id/status', changeUserStatus);
router.delete('/:id', deleteUser);

export default router;
