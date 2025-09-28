const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: "No authentication token, authorization denied." });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        if (!verified) {
            return res.status(401).json({ msg: "Token verification failed, authorization denied." });
        }

        req.user = verified; // Add user payload (id, role) to the request
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const isTeacher = (req, res, next) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ msg: "Access denied. Teacher role required." });
    }
    next();
};

module.exports = { auth, isTeacher };