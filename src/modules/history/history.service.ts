import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryDto } from './history.dto';
import { History } from './history.entity';

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

  async getHistory(id: string) {
    return await this.historyRepository.findAndCount({
      where: { user_id: id },
    });
  }
}
