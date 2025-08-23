import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { AuthenticationGuard } from 'src/infra/guards/authentication.guard';

@Controller('entries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @UseGuards(AuthenticationGuard)
  @Get('/en')
  getWords(@Query() params: { search: string }) {
    return this.dictionaryService.getWords(params?.search);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/en/:word')
  getSpecificWord(@Param('word') word: string) {
    return this.dictionaryService.getSpecificWord(word);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/en/:word/favorite')
  favoriteWord(@Param('word') word: string, @Request() req: Request) {
    const token = req.headers['authorization'];
    return this.dictionaryService.favoriteWord(word, token);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/en/:word/unfavorite')
  unfavoriteWord(@Param('word') word: string, @Request() req: Request) {
    const token = req.headers['authorization'];
    return this.dictionaryService.favoriteWord(word, token);
  }
}
