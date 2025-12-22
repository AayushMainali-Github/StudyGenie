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
        enum: ['pdf', 'docx', 'txt', 'text'],
        default: 'text'
    }
}, {
    timestamps: true,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
