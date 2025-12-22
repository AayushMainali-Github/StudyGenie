const Flashcard = require('../models/Flashcard');
const Note = require('../models/Note');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate flashcards from a note
// @route   POST /api/flashcards/generate/:noteId
// @access  Private
const generateFlashcards = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an expert educator. Create a set of 5-8 concise, high-quality flashcards from the following study notes.
        Each flashcard should focus on a single key concept.
        
        STRICT RULES:
        1. Format your response as a JSON array of objects, each with "question" and "answer" keys.
        2. DO NOT include any Markdown formatting outside the JSON, just the raw JSON array.
        3. If there are formulas or mathematical notations, use LaTeX format surrounded by $ for inline math (e.g., $E=mc^2$) and $$ for block math.
        
        Notes:
        ${note.content}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean text if Gemini wraps it in markdown code blocks
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const cardData = JSON.parse(text);

        const flashcards = await Promise.all(cardData.map(async (card) => {
            return await Flashcard.create({
                user: req.user._id,
                note: note._id,
                question: card.question,
                answer: card.answer
            });
        }));

        res.status(201).json(flashcards);
    } catch (error) {
        console.error('Error in generateFlashcards:', error);
        res.status(500).json({ message: 'Failed to generate flashcards', error: error.message });
    }
};

// @desc    Get flashcards for a specific note
// @route   GET /api/flashcards/note/:noteId
// @access  Private
const getFlashcardsByNote = async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ 
            user: req.user._id, 
            note: req.params.noteId 
        }).sort({ nextReview: 1 });
        
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch flashcards' });
    }
};

// @desc    Update flashcard progress (SM-2 Algorithm)
// @route   PUT /api/flashcards/:id/progress
// @access  Private
const updateFlashcardProgress = async (req, res) => {
    try {
        const { rating } = req.body; // 1-5 (1: Forgot, 5: Easy)
        const flashcard = await Flashcard.findById(req.params.id);

        if (!flashcard || flashcard.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        // SM-2 Algorithm implementation
        let { interval, repetition, efactor } = flashcard;

        if (rating >= 3) {
            if (repetition === 0) {
                interval = 1;
            } else if (repetition === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * efactor);
            }
            repetition += 1;
        } else {
            repetition = 0;
            interval = 1;
        }

        efactor = efactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        if (efactor < 1.3) efactor = 1.3;

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        flashcard.interval = interval;
        flashcard.repetition = repetition;
        flashcard.efactor = efactor;
        flashcard.nextReview = nextReview;

        await flashcard.save();
        res.json(flashcard);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update progress' });
    }
};

module.exports = { generateFlashcards, getFlashcardsByNote, updateFlashcardProgress };
