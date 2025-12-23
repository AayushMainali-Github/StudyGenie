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
        
        STRICT FORMAT RULES:
        1. Start with the keyword: mindmap
        2. Use a root node with a circle shape and Markdown syntax: root(${note.title})
        3. Use EXACTLY two spaces for EACH LEVEL of indentation.
        4. ALL other nodes MUST use the Markdown String syntax: ["\`label\`"]
        5. No markdown code blocks. Output ONLY raw Mermaid syntax.
        6. Keep it consice and to the point.
        
        EXAMPLE STRUCTURE:
        mindmap
          root(Title)
            ["\`Topic A\`"]
              ["\`Subtopic A1\`"]
            ["\`Topic B\`"]
        
        Notes content to deconstruct:
        ${note.content}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean if Gemini wraps it
        text = text.replace(/```mermaid/g, '').replace(/```/g, '').replace(/^mindmap\n?/i, '').trim();
        
        const lines = text.split('\n');
        const processedLines = [];
        
        processedLines.push('mindmap');
        
        let baseIndent = -1;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            
            const indentMatch = line.match(/^\s*/);
            const currentIndent = indentMatch ? indentMatch[0].length : 0;
            
            if (baseIndent === -1) baseIndent = currentIndent;
            
            const relativeIndent = Math.max(0, currentIndent - baseIndent);
            // Ensure 2-space steps
            const normalizedLevel = Math.floor(relativeIndent / 2);
            const indentStr = ' '.repeat(normalizedLevel * 2);
            
            // If it's the root with shape, keep it but ensure markdown
            if (trimmed.includes('root(')) {
                processedLines.push(`${indentStr}${trimmed}`);
            } else {
                // Strip existing quotes/markdown if Gemini added them incorrectly
                const cleanLabel = trimmed
                    .replace(/^\["[`]*/, '')
                    .replace(/[`]*"\]$/, '')
                    .replace(/^["']|["']$/g, '')
                    .replace(/"/g, "'") // Escape inner quotes
                    .trim();
                
                processedLines.push(`${indentStr}["\`${cleanLabel}\`"]`);
            }
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
