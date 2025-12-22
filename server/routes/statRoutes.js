const express = require('express');
const router = express.Router();
const { getOverviewStats } = require('../controllers/statController');
const { protect } = require('../middleware/authMiddleware');

router.get('/overview', protect, getOverviewStats);

module.exports = router;
