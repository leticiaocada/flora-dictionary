import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from '../favorite/favorite.service';
import { Favorite } from './favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  controllers: [],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
