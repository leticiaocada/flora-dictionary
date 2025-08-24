import { Test } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { BadRequestException } from '@nestjs/common';

const favoriteMock = {
  id: 1,
  user_id: '1',
  word: 'aa',
  added: new Date('2025-08-24T02:50:59.933Z'),
};

const favoriteHistoryMock = {
  results: [{ word: 'aa', added: '2025-08-24T02:50:59.933Z' }],
  totalDocs: 1,
  next: null,
  previous: 1,
  hasNext: false,
  hasPrev: false,
};

describe('favorite service', () => {
  let favoriteService: FavoriteService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: 'FavoriteRepository',
          useValue: {
            save: jest.fn().mockImplementation((value) => {
              if (value?.word === 'aa') {
                return favoriteMock;
              }
              if (value?.word === '')
                throw new BadRequestException('Unsuccesful save on favorites');
            }),
            findOne: jest.fn().mockImplementation((value) => {
              if (value?.where.word === 'alreadyInsertedWord') {
                return favoriteMock;
              }
            }),
            delete: jest.fn().mockReturnValue({ affected: 1 }),
            createQueryBuilder: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[favoriteMock], 1]),
          },
        },
      ],
    }).compile();

    favoriteService = moduleRef.get(FavoriteService);
  });

  describe('favorite', () => {
    it('should validate repetitive register in favorite list', async () => {
      try {
        await favoriteService.setFavorite('alreadyInsertedWord', '1');
      } catch (error: any) {
        expect(error.message).toBe('Word already exists in favorite list');
      }
    });

    it('should set favorite', async () => {
      const result = await favoriteService.setFavorite('aa', '1');
      expect(result.word).toBe(favoriteMock.word);
    });

    it('should handle exception setting favorite', async () => {
      try {
        await favoriteService.setFavorite('', '1');
      } catch (error: any) {
        expect(error.message).toBe('Unsuccesful save on favorites');
      }
    });

    it('should throw error when unfavorite word not found', async () => {
      try {
        await favoriteService.unfavorite('aa', '1');
      } catch (error: any) {
        expect(error.message).toBe('Favorite word not found');
      }
    });

    it('should unfavorite word', async () => {
      const result = await favoriteService.unfavorite(
        'alreadyInsertedWord',
        '1',
      );
      expect(result.affected).toBe(1);
    });

    it('should get favorites by userId', async () => {
      const result = await favoriteService.getFavoritesByUserId('1', {});
      expect(result.totalDocs).toBe(1);
    });
  });
});
