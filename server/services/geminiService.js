const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateNotes = async (text) => {
    try {
        // Using the absolute latest Flash model available.
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        
        const prompt = `
        You are an elite academic architect. Transform the provided text into a high-fidelity internal study report.
        
        STRICT STRUCTURAL RULES:
        1. NO HTML tags. 
        2. Use ## for Section Titles. Every Section Title MUST be followed by a '---' separator on its own line.
        3. Use ### for Sub-headings.
        4. Use bullet points ( - ) for all lists.
        5. Use **BOLD** for every key concept or definition.
        6. Math: Use LaTeX format ($...$ for inline, $$...$$ for blocks).
        7. SPACING: You MUST add exactly THREE empty lines between sections (after the --- divider).
        8. SPACING: Add exactly TWO empty lines between paragraphs.
        
        Text to process:
        ${text}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textOutput = response.text();
        return textOutput;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate notes with AI");
    }
};

module.exports = { generateNotes };
