/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Dictionary } from './dictionary.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getUserFromToken } from '../user/user.utils';
import { userTokenDto } from '../user/user.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { DictionaryEntry } from './dictionary.type';
import { HistoryService } from '../history/history.service';
import { GetWordsDTO } from './dictionary.dto';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
    private readonly favorite: FavoriteService,
    private readonly history: HistoryService,
  ) {}

  async getWords(dto: GetWordsDTO) {
    const limit = dto.limit || 4;

    const queryBuilder = this.dictionaryRepository
      .createQueryBuilder()
      .orderBy('id', dto.isPrevious ? 'DESC' : 'ASC')
      .take(limit + 1);

    if (dto.cursor) {
      if (dto.isPrevious) {
        queryBuilder.andWhere('id < :cursor', { cursor: dto.cursor });
      } else {
        queryBuilder.andWhere('id > :cursor', { cursor: dto.cursor });
      }
    }

    if (dto.search) {
      queryBuilder.andWhere('word ILIKE :search', {
        search: `%${dto.search}%`,
      });
    }

    const [results, totalDocs] = await queryBuilder.getManyAndCount();
    const hasNextPage = results.length > limit;
    let words = hasNextPage ? results.slice(0, limit) : results;
    if (dto.isPrevious) {
      words = words.reverse();
    }

    const nextCursor = hasNextPage ? words[words.length - 1].id : null;
    const prevCursor = words.length > 0 ? words[0].id : null;

    return {
      results: words.map((word) => word.word),
      totalDocs,
      next: nextCursor,
      previous: prevCursor,
      hasNext: hasNextPage,
      hasPrev: !!dto.cursor,
    };
  }

  async getSpecificWord(search: string) {
    const result = await this.dictionaryRepository.findOne({
      where: { word: search },
    });
    if (!result) {
      throw new BadRequestException('Word not found');
    }
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${result.word}`,
    );

    if (!res.ok) {
      throw new BadRequestException('Search unsuccesful');
    }

    const data: DictionaryEntry[] = await res.json();
    return data;
  }

  async favoriteWord(word: string, token: string) {
    const user: userTokenDto = getUserFromToken(token);
    await this.getSpecificWord(word);
    return await this.favorite.setFavorite(word, user.id);
  }

  async unfavoriteWord(word: string, token: string) {
    const user: userTokenDto = getUserFromToken(token);
    return await this.favorite.unfavorite(word, user.id);
  }

  async saveHistory(id: string, word: string) {
    try {
      return await this.history.registerHistory(id, word);
    } catch {
      throw new BadRequestException('Could not save history');
    }
  }
}
