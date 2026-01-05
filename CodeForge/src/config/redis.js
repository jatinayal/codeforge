const redis = require("redis");

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: false // 🚨 VERY IMPORTANT
    }
  });

  redisClient.on("connect", () => {
    console.log("Redis connected");
  });

  redisClient.on("error", (err) => {
    console.log("Redis error:", err.message);
  });
} else {
  console.log("Redis not configured");
}

module.exports = redisClient;
