import * as Redis from 'ioredis';

export const redisCache = new Redis({
  port: +process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || '127.0.0.1',
});

export default redisCache;
