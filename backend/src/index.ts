import "dotenv/config";
import express from "express";
import cors from "cors";
import { getSharedClientByIndex, getPrismaClientForShortId, resolveShardFromShortId } from "./config/shards";
import { connectRedis } from "./config/redis";
import { apiRouter, redirectRouter } from "./urlController";
import { register, login } from "./controllers/authController";


const app = express();
app.use(cors());
app.use(express.json());

// Mount the API router
app.use("/api", apiRouter);

// Mount the root redirect router
app.use("/", redirectRouter);
app.post("/api/auth/register", register)
app.post("/api/auth/login", login)

app.get("/health", async (_req, res) => {
    const shard0 = getSharedClientByIndex(0);
    const shard1 = getSharedClientByIndex(1);
    await shard0.$queryRaw`SELECT 1`;
    await shard1.$queryRaw`SELECT 1`;
    res.json({ ok: true, shards: 2 });
});

const port = Number(process.env.PORT) || 3000;

async function bootstrap() {
    // 1. Wait for Redis to connect before starting the web server
    await connectRedis();
    // 2. Start listening to web HTTP requests
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

bootstrap().catch(err => {
    console.error("Failed to start server", err);
    process.exit(1);
});
