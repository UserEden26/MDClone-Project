import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service'; // adjust path as needed

@Module({
  imports: [CacheModule.register({ ttl: 7200000 })],
  providers: [CacheService],
  exports: [CacheService],
})
export class CustomCacheModule {}
