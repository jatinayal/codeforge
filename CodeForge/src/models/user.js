const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    age: {
        type: Number,
        min: 6,
        max: 80,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: { 
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'problem',
            unique: true
        }] // REMOVED: unique: true, ADDED: default: []
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default:'https://res.cloudinary.com/dmbx0fco2/image/upload/v1757654279/nullUser_ublbax.png'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('submission').deleteMany({userId: userInfo._id});
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;