const redis = require('redis');


const redisClient = redis.createClient({
    username: 'default',
    password: 'VjXOECMbgYTqGqVSA0FbfsygVPpmyG9a',  
    socket: {
        host: 'redis-10518.c80.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 10518
    }
});


module.exports = redisClient;