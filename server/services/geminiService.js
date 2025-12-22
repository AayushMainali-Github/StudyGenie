const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateNotes = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        
        const prompt = `
        You are an expert academic assistant. Create structured, high-quality study notes from the provided text.
        
        STRICT RULES:
        1. DO NOT use any HTML tags (no <br>, no <div>, etc.).
        2. Use ONLY clean Markdown.
        3. Use ## for major sections and ### for sub-sections.
        4. Add exactly TWO newlines between different sections for clarity.
        5. Use bullet points for details.
        6. Bold important concepts using **bold**.
        7. If there are formulas, use clear text representation.
        
        Text to convert into study notes:
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
