const express = require('express');
const router = express.Router();
const { 
    generateQuiz, 
    getQuizzesByNote, 
    submitQuiz 
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate/:noteId', protect, generateQuiz);
router.get('/note/:noteId', protect, getQuizzesByNote);
router.post('/:id/submit', protect, submitQuiz);

module.exports = router;
