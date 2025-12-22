const Quiz = require('../models/Quiz');
const Note = require('../models/Note');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate a quiz from a note
// @route   POST /api/quizzes/generate/:noteId
// @access  Private
const generateQuiz = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an elite examiner. Create a challenging 5-10 question multiple-choice quiz based on the following study notes.
        
        STRICT RULES:
        1. Format your response as a JSON object with "title" and "questions" (array).
        2. Each question object MUST have: "question", "options" (array of exactly 4 strings), "correctAnswer" (0-3 index), and "explanation".
        3. Use LaTeX for ANY mathematical formulas (surround with $ or $$).
        4. Output ONLY raw JSON. No markdown code blocks.
        
        Notes:
        ${note.content}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean text if Gemini wraps it in markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const quizData = JSON.parse(text);

        const quiz = await Quiz.create({
            user: req.user._id,
            note: note._id,
            title: quizData.title || `Quiz for ${note.title}`,
            questions: quizData.questions
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error('Error in generateQuiz:', error);
        res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
    }
};

// @desc    Get quizzes for a specific note
// @route   GET /api/quizzes/note/:noteId
// @access  Private
const getQuizzesByNote = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ 
            user: req.user._id, 
            note: req.params.noteId 
        }).sort({ createdAt: -1 });
        
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
    try {
        const { score } = req.body;
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz || quiz.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        quiz.score = score;
        quiz.isCompleted = true;
        quiz.attempts += 1;

        await quiz.save();
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit quiz' });
    }
};

module.exports = { generateQuiz, getQuizzesByNote, submitQuiz };
