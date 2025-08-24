import { Test } from '@nestjs/testing';
import { HistoryService } from './history.service';

const historyMock = {
  id: 1,
  user_id: '1',
  word: 'aa',
  added: '2025-08-24T02:50:59.933Z',
};

const resultHistoryMock = {
  results: [{ word: 'aa', added: '2025-08-24T02:50:59.933Z' }],
  totalDocs: 1,
  next: null,
  previous: 1,
  hasNext: false,
  hasPrev: false,
};

describe('history service', () => {
  let historyService: HistoryService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: 'HistoryRepository',
          useValue: {
            create: jest.fn().mockReturnValue(historyMock),
            save: jest.fn().mockReturnValue(historyMock),
            createQueryBuilder: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[historyMock], 1]),
          },
        },
      ],
    }).compile();

    historyService = moduleRef.get(HistoryService);
  });

  describe('history', () => {
    it('should register history successfully', async () => {
      const result = await historyService.registerHistory('1', 'aaa');
      expect(result).toBe(historyMock);
    });

    it('should get history successfully', async () => {
      const result = await historyService.getHistory('1', {});
      expect(result).toStrictEqual(resultHistoryMock);
    });
  });
});
