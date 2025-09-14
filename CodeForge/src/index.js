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

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 

app.use("/user", authRouter);
app.use("/problem", problemRouter); 
app.use("/submission",submitRouter);
app.use('/chat', ChatAi); 
app.use("/video",videoRouter); 


const InitializeConnection = async () =>{
    try{
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

         app.listen(process.env.PORT, ()=>{
    console.log("Server is listining at port: " +process.env.PORT)
         })
    }
    catch(err){
        console.log("Error:", err.message);
    }
};

InitializeConnection();