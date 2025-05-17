import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  addTherapist,
  getTherapists,
  getTherapistById,
  updateTherapist,
  deleteTherapist,
  updateTherapistStatus,
  getTherapistStats,
} from '../../controllers/therapistController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('video/')
      ? 'uploads/learnerVideos/'
      : 'uploads/therapists/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/', upload.single('file'), addTherapist);
router.get('/', getTherapists);
router.get('/stats', getTherapistStats);
router.get('/:id', getTherapistById);
router.put('/:id', upload.single('file'), updateTherapist);
router.delete('/:id', deleteTherapist);
router.patch('/:id/status', updateTherapistStatus);

export default router;
