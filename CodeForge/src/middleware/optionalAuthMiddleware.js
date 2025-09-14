const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        // If there's no token, set req.user to null and continue
        if (!token) {
            req.user = null;
            return next();
        }

        // Verify the token
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        if (!_id) {
            req.user = null;
            return next();
        }

        // Find the user
        const user = await User.findById(_id);
        if (!user) {
            req.user = null;
            return next();
        }

        // Check if token is blocked in Redis
        const isTokenBlocked = await redisClient.exists(`token:${token}`);
        if (isTokenBlocked) {
            req.user = null;
            return next();
        }

        // If everything is valid, attach the user object
        req.user = user;
        next();
        
    } catch (err) {
        // If any error occurs, just continue with no user
        req.user = null;
        next();
    }
}

module.exports = optionalAuthMiddleware;