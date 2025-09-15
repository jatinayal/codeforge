const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Verify token
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        if (!_id) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Find user
        const result = await User.findById(_id);
        if (!result) {
            return res.status(401).json({ error: "User not found" });
        }

        // Check if token is blocked
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({ error: "Session expired" });
        }

        req.result = result;
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Session expired" });
        }
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = userMiddleware;