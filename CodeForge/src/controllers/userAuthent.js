const User = require('../models/user');
const validate = require('../utils/validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../config/redis');
const Submissions = require('../models/submissions');

const register = async(req, res) => {
    try {
        console.log('1. Request received:', req.body);

        validate(req.body);
        console.log('2. Validation passed');

        const {firstName, emailId, password} = req.body;
        console.log('3. Extracted fields');

        req.body.password = await bcrypt.hash(password, 10);
        console.log('4. Password hashed');

        req.body.role = 'user';
        console.log('5. Role set');

        const user = await User.create(req.body);
        console.log('6. User created:', user);

          const token = jwt.sign(
            { 
                _id: user._id, 
                emailId: user.emailId, 
                role: user.role 
            },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        console.log('7. Token generated');

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
            isPaid: user.isPaid,
            profileImage: user.profileImage
        }

        // Set cookie  
        res.cookie('token', token, {
  maxAge: 60 * 60 * 1000,
  httpOnly: true, 
  secure: process.env.NODE_ENV === 'production', 
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' 
});

        console.log('8. Cookie set');
        
        res.status(200).json({
            user: reply,
            message: "Register Successfully"
        });
        console.log('9. Response sent');

    } catch(err) {
        console.error('10. ERROR CAUGHT:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error code:', err.code);
        console.error('Error stack:', err.stack);
        
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ error: "Email already registered" });
        }
        return res.status(500).json({ 
            error: "Internal Server Error", 
            details: err.message 
        });
    }
}  

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Validate input
        if (!emailId || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Prepare user response
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
            isPaid: user.isPaid,
            profileImage: user.profileImage
        }

        // Generate token
        const token = jwt.sign(
            { 
                _id: user._id, 
                emailId: user.emailId, 
                role: user.role 
            },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        // Set cookie
           res.cookie('token', token, {
  maxAge: 60 * 60 * 1000,
  httpOnly: true, 
  secure: process.env.NODE_ENV === 'production', 
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' 
});

        // Send response
        res.status(200).json({
            user: reply,
            message: "Login Successful"
        }); 

    } catch (err) {
        console.error('Login error:', err);
        
        // Handle specific errors
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        
        // Generic error response (don't expose internal details)
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}
 

const logout = async(req,res) =>{
     try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);

        res.cookie("token",null,new Date(Date.now()));
        res.send("Logged Out Succecfully");
     }
    catch(err){
        res.status(503).send("Error: "+err.message);
    }
}


const adminRegister = async(req, res)=>{
    
    try{
        // if(req.result.role!='admin')
        //     throw new Error("Invalid Credentials");

        validate(req.body);

        const {firstName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password,10);

        req.body.role = 'admin';

        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, emailId:emailId, role:'admin'},process.env.JWT_KEY,{expiresIn: 60*60});

        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).send("User Registered Succesfully");

    }
    catch(err){
        res.status(401).send("Error: "+err.message)};
}


const deleteProfile = async(req, res)=>{
    try{
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        // await Submissions.deleteMany({userId});

        res.status(200).send("Deleted Succesfully");
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
}

const getUserInfo = async(req, res) => {
    try{
        const userId = req.result._id;
        // console.log("UserID: " , userId)
        if(!userId){
            return res.status(500).send("User ID Missing");
        }
        const response = await User.findById(userId).select('-password');
        // console.log("response", response)

        if(!response){
            return res.status(500).send("User not found");
        }

        res.status(201).send(response)
    }
    catch(err){
        res.status(404).send("User not Forund");
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        const { firstName, lastName, age, image } = req.body;

        // Validate input - only allow certain fields to be updated
        const updateData = {};
        
        if (firstName !== undefined && firstName !== '') {
            if (firstName.length < 3 || firstName.length > 20) {
                return res.status(400).json({ 
                    error: "First name must be between 3 and 20 characters" 
                });
            }
            updateData.firstName = firstName;
        }
        
        if (lastName !== undefined && lastName !== '') {
            if (lastName.length < 3 || lastName.length > 20) {
                return res.status(400).json({ 
                    error: "Last name must be between 3 and 20 characters" 
                });
            }
            updateData.lastName = lastName;
        }

        if (image !== undefined && image !== '') {
            // Better URL validation
            try {
                new URL(image); // This will throw an error for invalid URLs
            } catch (err) {
                return res.status(400).json({ 
                    error: "Please provide a valid image URL" 
                });
            }
            updateData.profileImage = image; // Changed from profileImage to image
        }
        
        if (age !== undefined && age !== '') {
            const ageNum = Number(age);
            if (isNaN(ageNum) || ageNum < 6 || ageNum > 80) {
                return res.status(400).json({ 
                    error: "Age must be a number between 6 and 80" 
                });
            }
            updateData.age = ageNum;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                error: "No valid fields provided for update" 
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (err) {
        console.error('Update profile error:', err);
        
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid data format" });
        }
        
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const getAllUser = async (req, res) => {
    try {
        // Get all users with their problemSolved count and sort by count descending
        const users = await User.aggregate([
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    emailId: 1,
                    age: 1,
                    profileImage: 1,
                    role: 1,
                    problemSolvedCount: { $size: "$problemSolved" },
                    createdAt: 1
                }
            },
            {
                $sort: { problemSolvedCount: -1 }
            },
            {
                $limit: 50 // Limit to top 50 users
            }
        ]);

        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ 
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const getUserData = async (req, res) => {
    try {
        const userId = req.params.id; // Use req.params.id (common convention)

        if (!userId) {
            return res.status(400).send("User ID is missing");
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(user); // Return as JSON with status 200
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const updateUserPlan = async (req, res) => {
    try {
        const userId = req.result._id;
        const { isPaid } = req.body;

        // Validate input - only allow isPaid field to be updated
        if (isPaid === undefined) {
            return res.status(400).json({ 
                error: "isPaid field is required" 
            });
        }

        if (typeof isPaid !== 'boolean') {
            return res.status(400).json({ 
                error: "isPaid must be a boolean value" 
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isPaid },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            user: updatedUser,
            message: "Plan updated successfully"
        });

    } catch (err) {
        console.error('Update plan error:', err);
        
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid data format" });
        }
        
        return res.status(500).json({ 
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

module.exports = {register, login, logout, adminRegister, deleteProfile, getUserInfo, updateUserProfile, getAllUser, getUserData, updateUserPlan};
