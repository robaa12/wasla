import "dotenv/config";
import express from "express";
import { getSharedClientByIndex,getPrismaClientForShortId,resolveShardFromShortId } from "./config/shards";
import { ok } from "node:assert";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
    const shard0 = getSharedClientByIndex(0);
    const shard1 = getSharedClientByIndex(1);
    await shard0.$queryRaw`SELECT 1`;
    await shard1.$queryRaw`SELECT 1`;
    res.json({ok: true,shards:2});
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
