const express = require('express');
const router = express.Router();
const { chatWithNote } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:noteId', protect, chatWithNote);

module.exports = router;
