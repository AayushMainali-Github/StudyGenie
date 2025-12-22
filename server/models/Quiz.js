const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    correctAnswer: {
        type: Number, // Index of the correct option
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    }
});

const quizSchema = mongoose.Schema({
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
    title: {
        type: String,
        required: true,
    },
    questions: [questionSchema],
    score: {
        type: Number,
        default: 0,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    attempts: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
