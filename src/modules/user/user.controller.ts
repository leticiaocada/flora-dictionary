import { Get, UseGuards, Inject, Req, Res, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationGuard } from '../../infra/guards/authentication.guard';
import { getUserFromToken } from './user.utils';
import { userTokenDto } from './user.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { DEFAULT_TTL } from '../../infra/cache/cache.constants';
import type { Request, Response } from 'express';
import { returnResponseWithHeaders } from '../../infra/http/http.utils';
import { PaginationDTO } from '../dictionary/dictionary.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Get('me/favorites')
  async getFavorites(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: PaginationDTO,
  ) {
    const start = performance.now();
    const user: userTokenDto = this.getUserFromToken(req);
    const cachedUserFavorites = await this.cacheManager.get(
      `${user.id}-favorites`,
    );

    if (cachedUserFavorites) {
      return returnResponseWithHeaders(start, res, 'HIT', cachedUserFavorites);
    }

    const result = await this.userService.getFavorites(user.id, params);

    await this.cacheManager.set(`${user.id}-favorites`, result, DEFAULT_TTL);

    return returnResponseWithHeaders(start, res, 'MISS', result);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const start = performance.now();
    const user: userTokenDto = this.getUserFromToken(req);
    const cachedProfile = await this.cacheManager.get(`${user.id}-profile`);

    if (cachedProfile) {
      return returnResponseWithHeaders(start, res, 'HIT', cachedProfile);
    }
    const result = await this.userService.getProfile(user.id);
    await this.cacheManager.set(`${user.id}-profile`, result, DEFAULT_TTL);

    return returnResponseWithHeaders(start, res, 'MISS', result!);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me/history')
  async getHistory(
    @Req() req: Request,
    @Query() params: PaginationDTO,
    @Res() res: Response,
  ) {
    const start = performance.now();
    const user: userTokenDto = this.getUserFromToken(req);
    const cachedHistory = await this.cacheManager.get(`${user.id}-history`);

    if (cachedHistory) {
      return returnResponseWithHeaders(start, res, 'HIT', cachedHistory);
    }

    const result = await this.userService.getHistory(user.id, params);
    await this.cacheManager.set(`${user.id}-history`, result, DEFAULT_TTL);

    return returnResponseWithHeaders(start, res, 'MISS', result);
  }

  private getUserFromToken(req: Request) {
    const token = req.headers['authorization']!;
    return getUserFromToken(token);
  }
}
