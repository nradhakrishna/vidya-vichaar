const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
let User = require('../models/user.model');

// --- REGISTRATION ---
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ msg: "Please enter all fields." });
        }

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ msg: "An account with this username already exists." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username.trim(),
            password: passwordHash,
            role,
        });
        const savedUser = await newUser.save();
        
        // Don't send password hash in response
        const userResponse = {
            id: savedUser._id,
            username: savedUser.username,
            role: savedUser.role,
            createdAt: savedUser.createdAt
        };
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: userResponse 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ msg: "Please enter all fields." });
        }

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ msg: "No account with this username has been registered." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret_key');
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- TOKEN VALIDATION ---
router.get('/validate', auth, (req, res) => {
    res.json({ 
        valid: true, 
        user: {
            id: req.user.id,
            role: req.user.role
        }
    });
});

module.exports = router;