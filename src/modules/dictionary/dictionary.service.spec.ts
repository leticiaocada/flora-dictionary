import { Test } from '@nestjs/testing';
import { DictionaryService } from './dictionary.service';
import { BadRequestException } from '@nestjs/common';
import { FavoriteService } from '../favorite/favorite.service';
import { HistoryService } from '../history/history.service';
import { getUserFromToken } from '../user/user.utils';

const dictionaryMock = {
  id: 1,
  user_id: '1',
  word: 'aa',
  added: new Date('2025-08-24T02:50:59.933Z'),
};

const dictionaryResults = {
  hasNext: false,
  hasPrev: false,
  next: null,
  previous: 1,
  results: ['aa'],
  totalDocs: 1,
};

jest.mock('../user/user.utils');

describe('dictionary service', () => {
  let dictionaryService: DictionaryService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DictionaryService,
        {
          provide: 'DictionaryRepository',
          useValue: {
            findOne: jest.fn().mockImplementation((value) => {
              if (value?.where.word === 'alreadyInsertedWord') {
                return dictionaryMock;
              }
            }),
            createQueryBuilder: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[dictionaryMock], 1]),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            registerHistory: jest.fn().mockResolvedValue(dictionaryMock),
          },
        },
        {
          provide: FavoriteService,
          useValue: {
            setFavorite: jest.fn().mockResolvedValue(dictionaryMock),
            unfavorite: jest.fn().mockResolvedValue(dictionaryMock),
          },
        },
      ],
    }).compile();

    dictionaryService = moduleRef.get(DictionaryService);
  });

  describe('dictionary', () => {
    it('should get words', async () => {
      const result = await dictionaryService.getWords({} as any);
      expect(result).toStrictEqual(dictionaryResults);
    });

    it('should get specific word', async () => {
      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => dictionaryMock,
      });
      const result = await dictionaryService.getSpecificWord(
        'alreadyInsertedWord',
      );
      expect(result).toBe(dictionaryMock);
    });

    it('should not get specific word when word not found in db', async () => {
      try {
        await dictionaryService.getSpecificWord('aa');
      } catch (error) {
        expect(error.message).toBe('Word not found');
      }
    });

    it('should handle api fetch error', async () => {
      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });
      try {
        await dictionaryService.getSpecificWord('alreadyInsertedWord');
      } catch (error) {
        expect(error.message).toBe('Search unsuccesful');
      }
    });

    it('should favorite word', async () => {
      (getUserFromToken as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      global.fetch = jest.fn();
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => dictionaryMock,
      });

      const result = await dictionaryService.favoriteWord(
        'alreadyInsertedWord',
        'token',
      );
      expect(result).toBe(dictionaryMock);
    });

    it('should unfavorite word', async () => {
      (getUserFromToken as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      const result = await dictionaryService.unfavoriteWord(
        'alreadyInsertedWord',
        'token',
      );
      expect(result).toBe(dictionaryMock);
    });

    it('should sabe history', async () => {
      const result = await dictionaryService.saveHistory(
        'alreadyInsertedWord',
        'token',
      );
      expect(result).toBe(dictionaryMock);
    });
  });
});
