import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from './dictionary.entity';
import { ConfigService } from '@nestjs/config';
import { FavoriteModule } from '../favorite/favorite.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dictionary]),
    FavoriteModule,
    HistoryModule,
  ],
  controllers: [DictionaryController],
  providers: [DictionaryService, ConfigService],
})
export class DictionaryModule {}
