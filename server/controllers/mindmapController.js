const Note = require('../models/Note');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate Mermaid.js mindmap syntax for a note
// @route   POST /api/mindmaps/generate/:noteId
// @access  Private
const generateMindMap = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Deconstruct the following study notes into a logical Mermaid.js mindmap.
        
        STRICT RULES:
        1. Use "mindmap" syntax (NOT graph TD).
        2. Root node should be the main title.
        3. Use indentation for hierarchy.
        4. No markdown code blocks. Output ONLY raw Mermaid syntax.
        5. Keep node text concise.
        
        Notes:
        ${note.content}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean if Gemini wraps it
        text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();

        note.mindmap = text;
        await note.save();

        res.json({ mindmap: text });
    } catch (error) {
        console.error('Mindmap generation error:', error);
        res.status(500).json({ message: 'Failed to map knowledge architecture', error: error.message });
    }
};

module.exports = { generateMindMap };
