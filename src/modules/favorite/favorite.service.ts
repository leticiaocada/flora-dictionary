import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async setFavorite(word: string, user_id: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { word, user_id },
    });

    if (favorite) {
      throw new BadRequestException('Word already exists in favorite list');
    }

    const now = new Date();
    try {
      return await this.favoriteRepository.save({ user_id, word, added: now });
    } catch {
      throw new BadRequestException('Unsuccesful save on favorites');
    }
  }

  async unfavorite(word: string, user_id: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { word, user_id },
    });

    if (!favorite) {
      throw new BadRequestException('Favorite word not found');
    }

    return this.favoriteRepository.delete({ user_id, word });
  }

  async getFavoritesByUserId(userId: string) {
    try {
      return await this.favoriteRepository.findAndCount({
        where: { user_id: userId },
      });
    } catch {
      throw new BadRequestException('No favorites listed');
    }
  }
}
