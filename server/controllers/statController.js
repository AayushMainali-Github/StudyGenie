const Note = require('../models/Note');
const Flashcard = require('../models/Flashcard');
const Quiz = require('../models/Quiz');

// @desc    Get user overview statistics
// @route   GET /api/stats/overview
// @access  Private
const getOverviewStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Total Notes
        const totalNotes = await Note.countDocuments({ user: userId });

        // 2. Flashcard Stats
        const flashcards = await Flashcard.find({ user: userId });
        const totalFlashcards = flashcards.length;
        const masteredFlashcards = flashcards.filter(f => f.repetition >= 3).length; // SM-2 maturity threshold

        // 3. Quiz Stats
        const quizzes = await Quiz.find({ user: userId, isCompleted: true });
        const totalQuizzes = quizzes.length;
        
        let averageAccuracy = 0;
        if (totalQuizzes > 0) {
            const totalScore = quizzes.reduce((acc, q) => acc + (q.score / q.questions.length), 0);
            averageAccuracy = Math.round((totalScore / totalQuizzes) * 100);
        }

        // 4. Weekly Activity (Simplified: notes created per day for last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentNotes = await Note.find({
            user: userId,
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            notes: {
                total: totalNotes,
                recent: recentNotes.length
            },
            flashcards: {
                total: totalFlashcards,
                mastered: masteredFlashcards
            },
            quizzes: {
                total: totalQuizzes,
                accuracy: averageAccuracy
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
};

module.exports = { getOverviewStats };
