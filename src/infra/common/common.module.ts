import { Global, Module } from '@nestjs/common';
import configModule from '../config/config.module';
import { DbModule } from '../db/db.module';

@Global()
@Module({
  imports: [configModule, DbModule],
})
export class CommonModule {}
