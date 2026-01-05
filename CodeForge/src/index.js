const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const main = require('./config/db');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemRouter');
const submitRouter = require('./routes/submit');
const cors = require('cors');
const ChatAi  = require('./controllers/chatAi');
const videoRouter = require('./routes/videoCreator');

// Configure CORS for both development and production
const allowedOrigins = [
  'http://localhost:5173', // Your local development URL
  'https://codeforge-3-rvwm.onrender.com' // REMOVED TRAILING SLASH
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 

app.use("/user", authRouter);
app.use("/problem", problemRouter); 
app.use("/submission",submitRouter);
app.use('/chat', ChatAi); 
app.use("/video",videoRouter); 

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

const InitializeConnection = async () => {
  try {
    // Connect MongoDB (critical)
    await main();
    console.log("MongoDB Connected");

    // Connect Redis (non-blocking)
    if (process.env.REDIS_HOST || process.env.REDIS_URL) {
      try {
        await redisClient.connect();
        console.log("Redis Connected");
      } catch (err) {
        console.log("Redis connection failed (skipping):", err.message);
      }
    } else {
      console.log("Redis not configured, skipping");
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server is listening at port:", PORT);
    });

  } catch (err) {
    console.log("Fatal Error:", err.message);
    process.exit(1); // Only exit if MongoDB fails
  }
};

InitializeConnection();
