import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(REDIS_URL);

// Key helpers
export const cityKey = (city: string) => `hotels:${city.toLowerCase()}`;

export async function saveHotelsSortedByPrice(city: string, hotels: any[]) {
  const key = cityKey(city);
  const pipeline = redis.pipeline();
  await redis.del(key);
  for (const h of hotels) {
    const value = JSON.stringify(h);
    // use price as score
    pipeline.zadd(key, h.price, value);
  }
  pipeline.expire(key, 60 * 10); // 10 min TTL
  await pipeline.exec();
}

export async function filterHotelsByPrice(city: string, min?: number, max?: number) {
  const key = cityKey(city);
  const minScore = (min ?? 0);
  const maxScore = (max ?? 10**12);
  const res = await redis.zrangebyscore(key, minScore, maxScore);
  return res.map((s) => JSON.parse(s));
}