const Note = require('../models/Note');
const { extractText } = require('../utils/fileExtractor');
const { generateNotes } = require('../services/geminiService');
const fs = require('fs');

// @desc    Create a new note from file or text
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
    try {
        let originalText = '';
        let title = req.body.title || 'Untitled Note';

        // 1. Extract Text
        if (req.file) {
            originalText = await extractText(req.file);
            title = req.body.title || req.file.originalname;
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
        } else if (req.body.text) {
            originalText = req.body.text;
        } else {
            return res.status(400).json({ message: 'Please provide a file or text' });
        }

        if (!originalText || originalText.trim().length === 0) {
            return res.status(400).json({ message: 'Could not extract text from file' });
        }

        // 2. Generate AI Notes
        console.log('Generating AI notes...');
        const generatedContent = await generateNotes(originalText);

        // 3. Save to DB
        const note = await Note.create({
            user: req.user._id,
            title,
            originalText,
            content: generatedContent,
            fileType: req.file ? req.file.mimetype : 'text',
        });

        res.status(201).json(note);

    } catch (error) {
        console.error('Error in createNote:', error);
        res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
};

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
    try {
        const Flashcard = require('../models/Flashcard');
        const Quiz = require('../models/Quiz');
        
        const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
        
        const notesWithMetadata = await Promise.all(notes.map(async (note) => {
            const [flashcardCount, quizCount] = await Promise.all([
                Flashcard.countDocuments({ note: note._id }),
                Quiz.countDocuments({ note: note._id })
            ]);
            return {
                ...note,
                hasFlashcards: flashcardCount > 0,
                hasQuiz: quizCount > 0
            };
        }));

        res.json(notesWithMetadata);
    } catch (error) {
        console.error('getNotes error:', error);
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (note && note.user.toString() === req.user._id.toString()) {
            res.json(note);
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch note' });
    }
};

module.exports = { createNote, getNotes, getNoteById };
