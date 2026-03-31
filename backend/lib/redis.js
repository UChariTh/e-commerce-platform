import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// MOCK Redis if UPSTASH_REDIS_URL is not provided or set to a placeholder
const isRedisConfigured = process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_URL !== "redis://localhost:6379";

let redisClient;

if (isRedisConfigured) {
    try {
        redisClient = new Redis(process.env.UPSTASH_REDIS_URL);
        console.log("Redis connected successfully.");
    } catch (error) {
        console.warn("Redis connection failed. Falling back to Mock Redis.");
        redisClient = createMockRedis();
    }
} else {
    console.log("Using Mock Redis (No configuration provided).");
    redisClient = createMockRedis();
}

function createMockRedis() {
	const store = new Map();
	return {
		get: async (key) => {
			return store.get(key) || null;
		},
		set: async (key, value, mode, duration) => {
			store.set(key, value);
			return "OK";
		},
		del: async (key) => {
			store.delete(key);
			return 1;
		},
		expire: async (key, seconds) => {
			return 1;
		},
		on: (event, callback) => {
			// console.log(`[MOCK REDIS] ON ${event}`);
		},
	};
}

export const redis = redisClient;
