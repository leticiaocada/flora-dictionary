import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryDto } from './history.dto';
import { History } from './history.entity';
import { PaginationDTO } from '../dictionary/dictionary.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  async registerHistory(id: string, word: string) {
    const now = new Date();
    const history: HistoryDto = { user_id: id, word, added: now };
    const insertHistory = this.historyRepository.create(history);
    return await this.historyRepository.save<History>(insertHistory);
  }

  async getHistory(id: string, params: PaginationDTO) {
    const limit = params.limit || 4;
    const queryBuilder = this.historyRepository
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
    queryBuilder.andWhere('user_id = :id', { id });

    const [results, totalDocs] = await queryBuilder.getManyAndCount();
    const hasNextPage = results.length > limit;
    let histories = hasNextPage ? results.slice(0, limit) : results;
    if (params.isPrevious) {
      histories = histories.reverse();
    }

    const nextCursor = hasNextPage ? histories[histories.length - 1].id : null;
    const prevCursor = histories.length > 0 ? histories[0].id : null;

    return {
      results: histories.map((history) => ({
        word: history.word,
        added: history.added,
      })),
      totalDocs,
      next: nextCursor,
      previous: prevCursor,
      hasNext: hasNextPage,
      hasPrev: !!params.cursor,
    };
  }
}
