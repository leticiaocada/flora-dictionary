import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { PaginationDTO } from '../dictionary/dictionary.dto';

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

  async getFavoritesByUserId(userId: string, params: PaginationDTO) {
    try {
      const limit = params.limit || 4;
      const queryBuilder = this.favoriteRepository
        .createQueryBuilder()
        .orderBy('id', params.isPrevious ? 'DESC' : 'ASC')
        .take(limit + 1);
      if (params.cursor) {
        if (params.isPrevious) {
          queryBuilder.andWhere('id < :cursor', { cursor: params.cursor });
        } else {
          queryBuilder.andWhere('id > :cursor', { cursor: params.cursor });
        }
      }
      queryBuilder.andWhere('user_id = :userId', { userId });
      const [results, totalDocs] = await queryBuilder.getManyAndCount();
      const hasNextPage = results.length > limit;
      let favorites = hasNextPage ? results.slice(0, limit) : results;
      if (params.isPrevious) {
        favorites = favorites.reverse();
      }

      const nextCursor = hasNextPage
        ? favorites[favorites.length - 1].id
        : null;
      const prevCursor = favorites.length > 0 ? favorites[0].id : null;

      return {
        results: favorites.map((favorite) => ({
          word: favorite.word,
          added: favorite.added,
        })),
        totalDocs,
        next: nextCursor,
        previous: prevCursor,
        hasNext: hasNextPage,
        hasPrev: !!params.cursor,
      };
    } catch {
      throw new BadRequestException('No favorites listed');
    }
  }
}
