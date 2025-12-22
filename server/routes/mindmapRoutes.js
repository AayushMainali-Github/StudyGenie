const express = require('express');
const router = express.Router();
const { generateMindMap } = require('../controllers/mindmapController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate/:noteId', protect, generateMindMap);

module.exports = router;
