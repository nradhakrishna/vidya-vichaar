const router = require('express').Router();
let Question = require('../models/question.model');
const User = require('../models/user.model');
const Class = require('../models/class.model');
const { auth, isTeacher } = require('../middleware/auth');

// GET: Fetch questions (class-based)
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.classId) {
            return res.status(400).json({ msg: "You are not associated with any class." });
        }

        let questions;
        if (req.user.role === 'teacher') {
            // Teacher gets all questions from their class
            questions = await Question.find({ classId: user.classId })
                .populate('user', 'username')
                .sort({ createdAt: -1 });
        } else {
            // Student gets all questions from their class (not just their own)
            questions = await Question.find({ classId: user.classId })
                .populate('user', 'username')
                .sort({ createdAt: -1 });
        }
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Add a new question (students only)
router.post('/add', auth, async (req, res) => {
    try {
        const { text, author } = req.body;
        
        if (!text) {
            return res.status(400).json({ msg: "Question text is required." });
        }

        const user = await User.findById(req.user.id);
        
        if (!user.classId) {
            return res.status(400).json({ msg: "You must be in a class to post questions." });
        }

        // Check for duplicate question from the same user in the same class
        const existingQuestion = await Question.findOne({
            text: text.trim(),
            user: req.user.id,
            classId: user.classId
        });

        if (existingQuestion) {
            return res.status(409).json({ 
                msg: "You have already asked this question in this class. Please check the existing questions or ask a different question." 
            });
        }

        const newQuestion = new Question({ 
            text: text.trim(), 
            author: author || user.username, 
            user: req.user.id,
            classId: user.classId
        });

        await newQuestion.save();
        res.json('Question added!');
    } catch (err) {
        // Handle MongoDB duplicate key error
        if (err.code === 11000) {
            return res.status(409).json({ 
                msg: "You have already asked this question in this class. Please check the existing questions or ask a different question." 
            });
        }
        res.status(400).json({ error: err.message });
    }
});

// PATCH: Update a question's status (teachers only)
router.patch('/update/:id', auth, isTeacher, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.classId) {
            return res.status(400).json({ msg: "You must be associated with a class." });
        }

        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json('Error: Question not found.');
        }

        // Check if the question belongs to the teacher's class
        if (question.classId.toString() !== user.classId.toString()) {
            return res.status(403).json('Error: You can only update questions from your class.');
        }

        question.status = req.body.status;
        await question.save();
        res.json('Question status updated!');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE: Delete a question by ID (teachers only)
router.delete('/:id', auth, isTeacher, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.classId) {
            return res.status(400).json({ msg: "You must be associated with a class." });
        }

        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json('Error: Question not found.');
        }

        // Check if the question belongs to the teacher's class
        if (question.classId.toString() !== user.classId.toString()) {
            return res.status(403).json('Error: You can only delete questions from your class.');
        }

        await Question.findByIdAndDelete(req.params.id);
        res.json('Question deleted.');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;