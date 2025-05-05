const redis = require('redis');

const redisClient = redis.createClient({
    username: 'anil',
    password: 'Success9090@',
    socket: {
        host: 'redis-11349.c92.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 11349
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
redisClient.connect().catch((err) => console.error('Redis connection error:', err));

module.exports = redisClient;