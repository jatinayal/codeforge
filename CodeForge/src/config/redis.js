const redis = require("redis");

const redisClient = redis.createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  console.log("Redis error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

module.exports = redisClient;
