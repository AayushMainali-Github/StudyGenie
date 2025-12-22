const Note = require('../models/Note');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Chat with the AI Tutor about a specific note
// @route   POST /api/chat/:noteId
// @access  Private
const chatWithNote = async (req, res) => {
    try {
        const { message, history } = req.body;
        const note = await Note.findById(req.params.noteId);
        
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an elite academic AI Tutor. You are helping a student understand their study notes.
        
        STRICT RULES:
        1. Base your answers ONLY on the context provided in the study notes.
        2. If the user asks something outside the scope of the notes, politely steer them back.
        3. Use LaTeX for ANY mathematical formulas (surround with $ for inline, $$ for block).
        4. Maintain a professional, encouraging, and highly academic tone.
        5. Use clear Markdown formatting for structure.
        
        Study Notes Context:
        ${note.content}
        
        Student Question:
        ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('Error in chatWithNote:', error);
        res.status(500).json({ message: 'Tutor is momentarily unavailable', error: error.message });
    }
};

module.exports = { chatWithNote };
