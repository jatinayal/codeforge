const express = require('express');
const { register, login, logout, adminRegister,deleteProfile, getUserInfo, updateUserProfile, getAllUser, getUserData, updateUserPlan } = require('../controllers/userAuthent');
const authRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');
 
authRouter.get('/getUserInfo',userMiddleware, getUserInfo);
authRouter.get('/getUserData/:id',userMiddleware, getUserData);
authRouter.post('/updatePlan',userMiddleware, updateUserPlan);
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',userMiddleware, logout);
authRouter.put('/profile',userMiddleware, updateUserProfile); 
authRouter.get('/leaderboard',userMiddleware, getAllUser);
authRouter.post('/admin/register',adminMiddleware, adminRegister); 
authRouter.delete("/deleteProfile",userMiddleware,deleteProfile);
authRouter.get("/check", optionalAuthMiddleware, (req, res) => {
    try {
        // Check if user exists (req.user is set by optionalAuthMiddleware)
        if (req.user) {
            const reply = {
                firstName: req.user.firstName,
                emailId: req.user.email, 
                _id: req.user._id,
                profileImage: req.user.profileImage,
                isPaid: req.user.isPaid
            }
 
            res.status(200).json({
                user: reply,
                message: "Valid User",
                isAuthenticated: true
            });
        } else {
            // No user found (not authenticated)
            res.status(200).json({
                user: null,
                message: "No valid user session",
                isAuthenticated: false
            });
        }
    } catch (error) {
        console.error('Error in /check route:', error);
        res.status(500).json({
            user: null,
            message: "Server error",
            isAuthenticated: false
        });
    }
});
// authRouter.get('./getProfile', getProfile);

module.exports = authRouter;