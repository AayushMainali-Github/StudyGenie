const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

const extractText = async (file) => {
    try {
        if (file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
             const result = await mammoth.extractRawText({ path: file.path });
             return result.value;
        } else if (file.mimetype === 'text/plain') {
            const data = fs.readFileSync(file.path, 'utf8');
            return data;
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error) {
        console.error('Error extraacting text:', error);
        throw new Error('Failed to extract text from file');
    }
};

module.exports = { extractText };
