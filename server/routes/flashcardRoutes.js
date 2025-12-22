const express = require('express');
const router = express.Router();
const { 
    generateFlashcards, 
    getFlashcardsByNote, 
    updateFlashcardProgress 
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/note/all', protect, async (req, res) => {
    try {
        const flashcards = await require('../models/Flashcard').find({ user: req.user._id });
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
});

router.post('/generate/:noteId', protect, generateFlashcards);
router.get('/note/:noteId', protect, getFlashcardsByNote);
router.put('/:id/progress', protect, updateFlashcardProgress);

module.exports = router;
