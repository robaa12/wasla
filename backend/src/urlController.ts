import express from "express";
import { generateShortId } from "./idGenerator";
import { getSharedClientByIndex, getPrismaClientForShortId, resolveShardFromShortId } from "./config/shards";
import { redisClient } from "./config/redis";
import { optionalAuth, requireAuth, AuthRequest } from "./middleware/auth";

export const apiRouter = express.Router();
export const redirectRouter = express.Router();

// Route for creating a short URL
apiRouter.post("/shorten", optionalAuth, async (req: AuthRequest, res) => {
    const { longUrl } = req.body;
    if (!longUrl) {
        return res.status(400).json({ error: "Missing longUrl in request body" });
    }
    // Generate a short ID for the URL
    const shortId = generateShortId();
    // Here you would typically save the longUrl and shortId to your database
    const prismaClient = getPrismaClientForShortId(shortId);
    await prismaClient.shortUrl.create({
        data: {
            id: shortId,
            longUrl: longUrl,
            createdAt: new Date(),
            userId: req.userId || null
        }
    });

    // Cache the mapping in Redis for quick retrieval (optional, but recommended for performance)
    await redisClient.set(shortId, longUrl, { EX: 60 * 60 * 24 }); // Cache for 24 hours
    // For now, we'll just return the short ID
    res.json({ shortId, longUrl });
});

// Route for redirecting from short URL to long URL
redirectRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    // First, check if the short ID exists in Redis
    const cachedLongUrl = await redisClient.get(id);
    if (cachedLongUrl) {
        return res.redirect(cachedLongUrl);
    }
    // If not in Redis, check the database
    const prismaClient = getPrismaClientForShortId(id);
    const record = await prismaClient.shortUrl.findUnique({
        where: { id }
    });
    if (record) {
        // Cache the result in Redis for future requests
        await redisClient.set(id, record.longUrl, { EX: 60 * 60 * 24 }); // Cache for 24 hours
        return res.redirect(record.longUrl);
    } else {
        return res.status(404).json({ error: "Short URL not found" });
    }
});

apiRouter.get("/debug/shard/:id", async (req, res) => {
    const { id } = req.params;
    const shardIndex = resolveShardFromShortId(id);
    res.json({ shortId: id, shardIndex });
});


apiRouter.get("/user/urls", requireAuth, async (req: AuthRequest, res) => {
    const prismaClient0 = getSharedClientByIndex(0);
    const prismaClient1 = getSharedClientByIndex(1);

    const urls0 = await prismaClient0.shortUrl.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" }
    });
    const urls1 = await prismaClient1.shortUrl.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" }
    });
    const allUrls = [...urls0, ...urls1].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    res.json(allUrls);
});
