const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'ta'],
        default: 'student'
    },
    // For teachers: classes they created
    // For students: class they joined
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: false
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;