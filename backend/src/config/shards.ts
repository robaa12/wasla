import {PrismaClient} from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

type ShardID = 0 | 1;

const shardUrls = [
  [process.env.DATABASE_URL_SHARD_1],
  [process.env.DATABASE_URL_SHARD_2]
];

if (!shardUrls[0] || !shardUrls[1]) {
  throw new Error('Both shard database URLs must be set in environment variables');
}

const pools = shardUrls.map((connectionString) => new Pool({ connectionString: connectionString[0] ,max: 10 ,idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000 }));

const sharedClients = pools.map(pool => new PrismaClient({adapter: new PrismaPg(pool) }));

export function resolveShardFromShortId(shortId: string): ShardID {
  let hash = 0;
  for (let i = 0; i < shortId.length; i++) {
    hash = (hash * 31 + shortId.charCodeAt(i)) % 2;
  }
  return (hash % sharedClients.length) as ShardID;
}

export function getPrismaClientForShortId(shortId: string): PrismaClient {
    const shardId = resolveShardFromShortId(shortId);
    return sharedClients[shardId];
}

export function getSharedClientByIndex(shardIndex: number): PrismaClient {
    if (shardIndex < 0 || shardIndex >= sharedClients.length) {
        throw new Error(`Shard index ${shardIndex} is out of bounds`);
    }
    return sharedClients[shardIndex];
}

export async function shutdownShardClients() {
    await Promise.all(sharedClients.map(client => client.$disconnect()));
    await Promise.all(pools.map(pool => pool.end()));
}

