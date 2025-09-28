const router = require('express').Router();
const Class = require('../models/class.model');
const User = require('../models/user.model');
const { auth, isTeacher } = require('../middleware/auth');

// POST: Create a new class (teachers only)
router.post('/create', auth, isTeacher, async (req, res) => {
    try {
        const { className, subject } = req.body;

        if (!className || !subject) {
            return res.status(400).json({ msg: "Please provide class name and subject." });
        }

        // Check if teacher already has a class
        const existingClass = await Class.findOne({ teacher: req.user.id, isActive: true });
        if (existingClass) {
            return res.status(400).json({ msg: "You already have an active class. Please deactivate the current class first." });
        }

        const newClass = new Class({
            className,
            subject,
            teacher: req.user.id
        });

        const savedClass = await newClass.save();

        // Update teacher's classId
        await User.findByIdAndUpdate(req.user.id, { classId: savedClass._id });

        res.status(201).json({
            message: 'Class created successfully',
            class: {
                id: savedClass._id,
                className: savedClass.className,
                subject: savedClass.subject,
                classCode: savedClass.classCode,
                teacher: savedClass.teacher
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Join a class using class code (students only)
router.post('/join', auth, async (req, res) => {
    try {
        const { classCode } = req.body;

        if (!classCode) {
            return res.status(400).json({ msg: "Please provide class code." });
        }

        // Check if user is a student
        if (req.user.role !== 'student') {
            return res.status(400).json({ msg: "Only students can join classes." });
        }

        // Check if student is already in a class
        const user = await User.findById(req.user.id);
        if (user.classId) {
            return res.status(400).json({ msg: "You are already in a class." });
        }

        // Find class by code
        const targetClass = await Class.findOne({ classCode: classCode.toUpperCase(), isActive: true });
        if (!targetClass) {
            return res.status(404).json({ msg: "Invalid class code or class is not active." });
        }

        // Add student to class
        targetClass.students.push(req.user.id);
        await targetClass.save();

        // Update student's classId
        await User.findByIdAndUpdate(req.user.id, { classId: targetClass._id });

        res.json({
            message: 'Successfully joined class',
            class: {
                id: targetClass._id,
                className: targetClass.className,
                subject: targetClass.subject,
                classCode: targetClass.classCode
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Get class information (for current user)
router.get('/my-class', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('classId');
        
        if (!user.classId) {
            return res.status(404).json({ msg: "You are not associated with any class." });
        }

        const classData = await Class.findById(user.classId._id)
            .populate('teacher', 'username')
            .populate('students', 'username');

        res.json({
            class: {
                id: classData._id,
                className: classData.className,
                subject: classData.subject,
                classCode: classData.classCode,
                teacher: classData.teacher,
                students: classData.students,
                studentCount: classData.students.length
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Get all classes (teachers only - for management)
router.get('/all', auth, isTeacher, async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.user.id })
            .populate('students', 'username')
            .sort({ createdAt: -1 });

        res.json(classes.map(cls => ({
            id: cls._id,
            className: cls.className,
            subject: cls.subject,
            classCode: cls.classCode,
            studentCount: cls.students.length,
            isActive: cls.isActive,
            createdAt: cls.createdAt
        })));

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH: Deactivate a class (teachers only)
router.patch('/deactivate/:id', auth, isTeacher, async (req, res) => {
    try {
        const classId = req.params.id;
        
        const targetClass = await Class.findOne({ _id: classId, teacher: req.user.id });
        if (!targetClass) {
            return res.status(404).json({ msg: "Class not found or you don't have permission to modify it." });
        }

        targetClass.isActive = false;
        await targetClass.save();

        // Remove classId from all students in this class
        await User.updateMany(
            { _id: { $in: targetClass.students } },
            { $unset: { classId: 1 } }
        );

        // Remove classId from teacher
        await User.findByIdAndUpdate(req.user.id, { $unset: { classId: 1 } });

        res.json({ message: 'Class deactivated successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Leave class (students only)
router.delete('/leave', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(400).json({ msg: "Only students can leave classes." });
        }

        const user = await User.findById(req.user.id);
        if (!user.classId) {
            return res.status(400).json({ msg: "You are not in any class." });
        }

        // Remove student from class
        await Class.findByIdAndUpdate(user.classId, {
            $pull: { students: req.user.id }
        });

        // Remove classId from student
        await User.findByIdAndUpdate(req.user.id, { $unset: { classId: 1 } });

        res.json({ message: 'Successfully left the class' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;