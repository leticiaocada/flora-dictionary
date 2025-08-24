import { Module } from '@nestjs/common';
import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheManagerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          stores: [createKeyv(configService.get('redisUrl'))],
        };
      },
    }),
  ],
  exports: [CacheManagerModule],
})
export class CacheModule {}
