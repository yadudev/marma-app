const express = require('express');
const multer = require('multer');
const {
  createVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
} = require('../../controllers/learnerVideoController.js');
const authenticateToken = require('../../middlewares/auth.js');
const { isAdmin } = require('../../middlewares/roleCheck.js');

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

module.exports = router;
