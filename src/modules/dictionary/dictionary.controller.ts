import {
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { AuthenticationGuard } from 'src/infra/guards/authentication.guard';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { DEFAULT_TTL } from 'src/infra/cache/cache.constants';
import { returnResponseWithHeaders } from 'src/infra/http/http.utils';
import type { Request, Response } from 'express';
import { getUserFromToken } from '../user/user.utils';
import { userTokenDto } from '../user/user.dto';

@Controller('entries')
export class DictionaryController {
  constructor(
    private readonly dictionaryService: DictionaryService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Get('/en')
  async getWords(@Query() params: { search: string }, @Res() res: Response) {
    const start = performance.now();

    const cachedWords = await this.cacheManager.get(
      `getWords-${params?.search}`,
    );
    if (cachedWords) {
      return returnResponseWithHeaders(start, res, 'HIT', cachedWords);
    }

    const result = await this.dictionaryService.getWords(params?.search);
    await this.cacheManager.set(
      `getWords-${params?.search}`,
      result,
      DEFAULT_TTL,
    );

    return returnResponseWithHeaders(start, res, 'MISS', result);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/en/:word')
  async getSpecificWord(
    @Param('word') word: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const start = performance.now();
    const cachedSpecificWord = await this.cacheManager.get(
      `getSpecificWord-${word}`,
    );
    if (cachedSpecificWord) {
      return returnResponseWithHeaders(start, res, 'HIT', cachedSpecificWord);
    }

    const result = await this.dictionaryService.getSpecificWord(word);
    const token = req.headers['authorization']!;
    const user: userTokenDto = getUserFromToken(token);
    await this.dictionaryService.saveHistory(user.id, word);

    await this.cacheManager.set(`getSpecificWord-${word}`, result, DEFAULT_TTL);

    return returnResponseWithHeaders(start, res, 'MISS', result);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/en/:word/favorite')
  async favoriteWord(@Param('word') word: string, @Req() req: Request) {
    const token = req.headers['authorization']!;
    return this.dictionaryService.favoriteWord(word, token);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/en/:word/unfavorite')
  async unfavoriteWord(@Param('word') word: string, @Req() req: Request) {
    const token = req.headers['authorization']!;
    return this.dictionaryService.unfavoriteWord(word, token);
  }
}
