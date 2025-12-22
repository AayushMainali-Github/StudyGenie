const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String, // The generated markdown content
        required: true,
    },
    originalText: {
        type: String, // Extracted text from file
    },
    tags: [String],
    fileType: {
        type: String,
        // Accept both extensions and mimetypes
        enum: ['pdf', 'docx', 'txt', 'text', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        default: 'text'
    }
}, {
    timestamps: true,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
