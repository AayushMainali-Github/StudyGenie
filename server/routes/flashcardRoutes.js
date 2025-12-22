const express = require('express');
const router = express.Router();
const { 
    generateFlashcards, 
    getFlashcardsByNote, 
    updateFlashcardProgress 
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate/:noteId', protect, generateFlashcards);
router.get('/note/:noteId', protect, getFlashcardsByNote);
router.put('/:id/progress', protect, updateFlashcardProgress);

module.exports = router;
