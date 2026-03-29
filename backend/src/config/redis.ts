import { createClient } from "redis";

// Create a Redis client instance
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

// Event listener for successful connection
export async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Connected to Redis successfully");
    } catch (err) {
        console.error("Failed to connect to Redis", err);
        process.exit(1); // Exit the application if Redis connection fails
    }
}
// Event listener for errors
redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

export { redisClient };
