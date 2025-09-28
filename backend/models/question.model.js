const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    text: { type: String, required: true, trim: true },
    author: { type: String, required: false, trim: true, default: 'Anonymous' },
    status: { type: String, required: true, enum: ['unanswered', 'answered', 'important'], default: 'unanswered' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
}, {
    timestamps: true,
});

// Add compound index to prevent duplicate questions from same user in same class
questionSchema.index({ text: 1, user: 1, classId: 1 }, { unique: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;