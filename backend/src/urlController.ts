import express from "express";
import { generateShortId } from "./idGenerator";
import { getSharedClientByIndex,getPrismaClientForShortId } from "./config/shards";
import { redisClient } from "./config/redis";

export const urlRouter = express.Router();

// Placeholder route for creating a short URL
urlRouter.post("/shorten", async (req, res) => {
    const {longUrl} = req.body;
    if (!longUrl) {
        return res.status(400).json({error: "Missing longUrl in request body"});
    }
    // Generate a short ID for the URL
    const shortId = generateShortId();
    // Here you would typically save the longUrl and shortId to your database
    const prismaClient = getPrismaClientForShortId(shortId);
    await prismaClient.shortUrl.create({
        data: {
            id: shortId,
            longUrl: longUrl,
            createdAt: new Date()
        }
    });

    // Cache the mapping in Redis for quick retrieval (optional, but recommended for performance)
    await redisClient.set(shortId, longUrl, { EX: 60 * 60 * 24 }); // Cache for 24 hours
    // For now, we'll just return the short ID
    res.json({shortId, longUrl});
});
