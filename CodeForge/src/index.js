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
  origin: allowedOrigins,  
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
    console.log("Starting server...");

    // MongoDB (critical)
    await main();
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server listening on port", PORT);
    });

    // Redis (NON-BLOCKING, AFTER SERVER START)
    if (redisClient) {
      redisClient.connect()
        .then(() => console.log("Redis ready"))
        .catch(err => console.log("Redis skipped:", err.message));
    }

  } catch (err) {
    console.log("Startup error:", err.message);
  }
};

InitializeConnection();
