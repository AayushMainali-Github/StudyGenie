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

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Deconstruct the following study notes into a logical Mermaid.js mindmap.
        
        STRICT RULES:
        1. Use "mindmap" syntax.
        2. Root node should be the main title.
        3. Use EXACTLY two spaces for each level of indentation.
        4. No markdown code blocks. Output ONLY raw Mermaid syntax starting with "mindmap".
        5. IMPORTANT: Node labels containing spaces, parentheses, or special characters MUST be enclosed in double quotes. Example: id["Label (Extra Info)"] or "This is a Label".
        6. Keep node text concise.
        
        Notes:
        ${note.content}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean if Gemini wraps it
        text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
        
        // Post-processing to ensure labels with special characters are quoted
        // This is a simple regex attempt to fix common issues if Gemini forgets quotes
        // We'll look for lines that look like:   Node Text (info)
        // and turn them into:   "Node Text (info)"
        const lines = text.split('\n');
        const processedLines = lines.map(line => {
            const indent = line.match(/^\s*/)[0];
            const content = line.trim();
            if (content === 'mindmap' || content === '') return line;
            if (content.startsWith('"') && content.endsWith('"')) return line;
            // Quote the content if it's not already quoted
            return `${indent}"${content.replace(/"/g, "'")}"`;
        });
        
        const finalizedText = processedLines.join('\n');

        note.mindmap = finalizedText;
        await note.save();

        res.json({ mindmap: finalizedText });
    } catch (error) {
        console.error('Mindmap generation error:', error);
        res.status(500).json({ message: 'Failed to map knowledge architecture', error: error.message });
    }
};

module.exports = { generateMindMap };
