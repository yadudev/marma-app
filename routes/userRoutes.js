const express = require('express');
const { getDashboard } = require('../controllers/userController.js');

const router = express.Router();

// User Dashboard
router.get('/dashboard', getDashboard);

module.exports = router;
