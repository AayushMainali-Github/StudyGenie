const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateNotes = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        
        const prompt = `
        You are an expert student tutor. Create comprehensive, well-structured study notes from the following text.
        
        Format the output in clean Markdown:
        - Use ## for main topics.
        - Use bullet points for key details.
        - Highlight important terms in **bold**.
        - Include valid HTML line breaks if necessary for spacing.
        
        Text to summarize:
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
