import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set<T>(key: string, value: T, ttl: number = 7200000): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.log(`Cache set for key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to set cache for key: ${key}`, error.stack);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      this.logger.log(`Cache get for key: ${key}`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get cache for key: ${key}`, error.stack);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.log(`Cache deleted for key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete cache for key: ${key}`, error.stack);
    }
  }

  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
      this.logger.log(`Cache reset`);
    } catch (error) {
      this.logger.error(`Failed to reset cache`, error.stack);
    }
  }
}
