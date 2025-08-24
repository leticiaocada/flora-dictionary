/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Dictionary } from './dictionary.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getUserFromToken } from '../user/user.utils';
import { userTokenDto } from '../user/user.dto';
import { FavoriteService } from '../favorite/favorite.service';
import { DictionaryEntry } from './dictionary.type';
import { HistoryService } from '../history/history.service';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
    private readonly favorite: FavoriteService,
    private readonly history: HistoryService,
  ) {}

  async getWords(search: string) {
    if (!search) {
      return await this.dictionaryRepository.findAndCount();
    }
    return await this.dictionaryRepository.findAndCount({
      where: { word: ILike(`%${search}%`) },
    });
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
    const result = await this.favorite.setFavorite(word, user.id);
    return result;
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
