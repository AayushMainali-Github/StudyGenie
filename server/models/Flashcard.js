const mongoose = require('mongoose');

const flashcardSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Note',
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    // Spaced Repetition (SM-2 Algorithm) Fields
    interval: {
        type: Number,
        default: 0, // Days until next review
    },
    repetition: {
        type: Number,
        default: 0, // Number of consecutive successful reviews
    },
    efactor: {
        type: Number,
        default: 2.5, // Easiness factor
    },
    nextReview: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
