const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    className: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    classCode: {
        type: String,
        required: false, // Will be auto-generated, so not required initially
        unique: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                return !v || v.length === 6;
            },
            message: 'Class code must be exactly 6 characters long'
        }
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    teachingAssistants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

// Generate unique class code before saving
classSchema.pre('save', async function(next) {
    // Always generate a new class code if one doesn't exist
    if (!this.classCode) {
        this.classCode = await generateUniqueClassCode();
    }
    next();
});

// Function to generate unique 6-character class code
async function generateUniqueClassCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;
    
    while (!isUnique) {
        code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const existingClass = await mongoose.model('Class').findOne({ classCode: code });
        if (!existingClass) {
            isUnique = true;
        }
    }
    
    return code;
}

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
