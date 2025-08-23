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

  async setFavorite(word: string, user_id: number) {
    const favorite = { user_id, word };
    try {
      return await this.favoriteRepository.save(favorite);
    } catch {
      throw new BadRequestException('Unsuccesful save on favorites');
    }
  }

  async unfavorite(word: string, user_id: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: { word, user_id },
    });
    if (!favorite) {
      throw new BadRequestException('Word not found');
    }
    return this.favoriteRepository.delete({ user_id, word });
  }
}
