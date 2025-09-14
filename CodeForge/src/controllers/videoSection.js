const cloudinary = require('cloudinary').v2;
const Problem = require('../models/problem');
const User = require('../models/user');
const SolutionVideo = require('../models/solutionVideo');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});  
 
const generateUploadSignature = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.result._id;

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `codeforge-solutions/${problemId}/${userId}_${timestamp}`;

        const uploadParams = {
            timestamp: timestamp,
            public_id: publicId,
        };

        // Generate signature
        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            public_id: publicId,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        });
    } catch (err) {
        console.error("Error generating upload signature: ", err);
        res.status(500).send("Internal server Error");
    }
};

const saveVideoMetadata = async (req, res) => {
    try {
        const {
            problemId,
            cloudinaryPublicId,
            secureUrl,
            duration,
        } = req.body;

        const userId = req.result._id;

        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            { resource_type: 'video' }
        );
        if (!cloudinaryResource) {
            return res.status(400).json({ error: 'Video not found on Cloudinary' });
        }

        const existingVideo = await SolutionVideo.findOne({
            problemId,
            userId,
            cloudinaryPublicId
        });

        if (existingVideo) {
            return res.status(409).json({ error: "Video already exists" });
        }

        const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id, {resource_type: "video"});

        const videoSolution = new SolutionVideo({
            problemId,
            userId,
            cloudinaryPublicId,
            secureUrl,
            duration: cloudinaryResource.duration || duration,
            thumbnailUrl
        });

        await videoSolution.save();
        res.status(201).json({ message: "Video metadata saved successfully", video: videoSolution });
    } catch (err) {
        console.error("Error saving video metadata: ", err);
        res.status(500).send("Internal server Error");
    }
};
const deleteVideo = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.result._id;

        // Find the video for this problem and user
        const video = await SolutionVideo.findOne({ problemId: problemId, userId: userId });
        console.log(video);
        
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Check if the user owns the video (redundant since we already filtered by userId, but keeping for safety)
        if (video.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this video' });
        }

        // Delete the video from database
        await SolutionVideo.findByIdAndDelete(video._id);
        
        // Delete the video from Cloudinary
        await cloudinary.uploader.destroy(video.cloudinaryPublicId, { 
            resource_type: 'video', 
            invalidate: true 
        });

        res.json({ message: 'Video deleted successfully' });
    } catch (err) {
        res.status(500).send("Internal server Error");
    }
};
module.exports = { generateUploadSignature, saveVideoMetadata, deleteVideo };