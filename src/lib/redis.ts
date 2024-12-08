
import Redis from 'ioredis';


// Define a Redis client using environment variables
const redis = new Redis({
    host: process.env.REDIS_HOST as string, // Ensure type-safety
    port: Number(process.env.REDIS_PORT), // Convert port to number
    password: process.env.REDIS_PASSWORD || undefined, // Optional password
});

// Redis connection event listeners
redis.on('connect', () => {
    console.log('Connected to Redis Cloud');
});

redis.on('error', (err: Error) => {
    console.error('Redis error:', err);
});

// Export the Redis client
export default redis;
