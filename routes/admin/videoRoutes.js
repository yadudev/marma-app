import express from 'express';
import multer from 'multer';
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
} from '../../controllers/learnerVideoController.js';
import { isAdmin } from '../../middlewares/roleCheck.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, file, cb) => cb(null, 'uploads/learnerVideos/'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', authenticateToken, isAdmin, upload.single('video'), createVideo);
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.put('/:id', authenticateToken, isAdmin, upload.single('video'), updateVideo);
router.delete('/:id', authenticateToken, isAdmin, deleteVideo);

export default router;
