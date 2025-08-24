import { Global, Module } from '@nestjs/common';
import configModule from '../config/config.module';
import { DbModule } from '../db/db.module';
import { CacheModule } from '../cache/cache.module';

@Global()
@Module({
  imports: [configModule, DbModule, CacheModule],
  exports: [DbModule, CacheModule],
})
export class CommonModule {}
