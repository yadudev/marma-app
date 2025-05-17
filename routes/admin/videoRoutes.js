import express from 'express';
import multer from 'multer';
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
} from '../../controllers/learnerVideoController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, file, cb) => cb(null, 'uploads/learnerVideos/'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', upload.single('video'), createVideo);
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.put('/:id', upload.single('video'), updateVideo);
router.delete('/:id', deleteVideo);

export default router;
