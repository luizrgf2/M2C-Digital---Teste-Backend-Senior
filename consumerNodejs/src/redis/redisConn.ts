import { createClient } from 'redis';
import { RedisClientType } from "@redis/client";


class RedisSingleton {
  private static instance: RedisClientType | null = null;

  private constructor() {}

  static getInstance(): RedisClientType {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = createClient({url: process.env.REDIS_URL});

      RedisSingleton.instance.on('connect', () => {
        console.log('redis connected!');
      });

      RedisSingleton.instance.on('error', (err) => {
        console.error('error to connect redis:', err);
      });

      RedisSingleton.instance.connect().catch(console.error);
    }

    return RedisSingleton.instance;
  }
}

export default RedisSingleton;
