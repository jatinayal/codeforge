const redis = require("redis");

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.log("Redis max retries reached, giving up");
          return new Error("Retry time exhausted");
        }
        return Math.min(retries * 50, 2000);
      }
    }
  });

  redisClient.on("connect", () => {
    console.log("Redis connected");
  });
  
  redisClient.on("ready", () => {
    console.log("Redis ready");
  });
  
  redisClient.on("reconnecting", () => {
    console.log("Redis reconnecting");
  });

  redisClient.on("error", (err) => {
    console.log("Redis error:", err.message);
  });
} else {
  console.log("Redis not configured");
}

module.exports = redisClient;
