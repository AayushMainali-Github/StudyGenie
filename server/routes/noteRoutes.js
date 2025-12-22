const express = require('express');
const router = express.Router();
const { createNote, getNotes, getNoteById } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getNotes)
    .post(protect, upload.single('file'), createNote);

router.route('/:id')
    .get(protect, getNoteById);

module.exports = router;
