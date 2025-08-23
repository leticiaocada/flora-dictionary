/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Dictionary } from './dictionary.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getUserFromToken } from '../user/user.utils';
import { userTokenDto } from '../user/user.dto';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
    private readonly favorite: FavoriteService,
  ) {}

  async getWords(search: string) {
    const [result, total] = await this.dictionaryRepository.findAndCount({
      where: { word: ILike(`%${search}%`) },
    });
    return result;
  }

  async getSpecificWord(search: string) {
    const result = await this.dictionaryRepository.findOne({
      where: { word: search },
    });
    if (!result) {
      throw new BadRequestException('Word not found');
    }
    const apiResponse = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${result.word}`,
    );

    if (!apiResponse.ok) {
      throw new BadRequestException('Search unsuccesful');
    }
    const data = await apiResponse.json();
    return data;
  }

  favoriteWord(word: string, token: string) {
    const user: userTokenDto = getUserFromToken(token);
    try {
      this.getSpecificWord(word);
      const result = this.favorite.setFavorite(word, user.id);
      return result;
    } catch {
      throw new BadRequestException('Word does not exist');
    }
  }

  unfavoriteWord(word: string, token: string) {
    const user: userTokenDto = getUserFromToken(token);
    const result = this.favorite.unfavorite(word, user.id);
    return result;
  }
}
