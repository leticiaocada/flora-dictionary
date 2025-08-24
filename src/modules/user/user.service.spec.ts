import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FavoriteService } from '../favorite/favorite.service';
import { HistoryService } from '../history/history.service';
import { BadRequestException } from '@nestjs/common';

const userMock: User = {
  id: '1',
  name: 'test',
  email: 'email@test.com',
  password: 'pswd',
};

const favoriteMock = {
  results: [
    {
      word: 'aa',
      added: '2025-08-24T02:50:59.933Z',
    },
    {
      word: 'aaa',
      added: '2025-08-24T02:51:09.300Z',
    },
    {
      word: 'a',
      added: '2025-08-24T02:51:14.240Z',
    },
    {
      word: 'bb',
      added: '2025-08-24T02:51:18.481Z',
    },
  ],
  totalDocs: 4,
  next: null,
  previous: 15,
  hasNext: false,
  hasPrev: false,
};

const historyMock = {
  results: [
    {
      word: 'aa',
      added: '2025-08-24T02:50:59.933Z',
    },
    {
      word: 'aaa',
      added: '2025-08-24T02:51:09.300Z',
    },
    {
      word: 'a',
      added: '2025-08-24T02:51:14.240Z',
    },
    {
      word: 'bb',
      added: '2025-08-24T02:51:18.481Z',
    },
  ],
  totalDocs: 4,
  next: null,
  previous: 15,
  hasNext: false,
  hasPrev: false,
};

describe('user service', () => {
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: {
            create: jest.fn().mockImplementation((value) => {
              if (value?.email) {
                return userMock;
              }
            }),
            save: jest.fn().mockImplementation((value) => {
              if (value) {
                return userMock;
              }
              if (!value?.email) {
                throw new BadRequestException('Error creating user');
              }
            }),
            findOne: jest.fn().mockResolvedValue(userMock),
          },
        },
        {
          provide: FavoriteService,
          useValue: {
            getFavoritesByUserId: jest.fn().mockImplementation((value) => {
              if (value?.id !== '') {
                return favoriteMock;
              }
              if (value?.id === '') {
                throw new BadRequestException('Error returning favorites');
              }
            }),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            getHistory: jest.fn().mockImplementation((value) => {
              if (value?.id !== '') {
                return historyMock;
              }
              if (value?.id === '') {
                throw new BadRequestException('Failed to retrieve history');
              }
            }),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get(UserService);
  });

  describe('create user', () => {
    it('should create a new user succesfully', async () => {
      const result = await userService.createUser({
        name: userMock.name,
        email: userMock.email,
        password: userMock.password,
      });
      expect(result.id).toBe(userMock.id);
    });

    it('should handle exception creating user', async () => {
      try {
        await userService.createUser({} as any);
      } catch (error: any) {
        expect(error.message).toBe('Error creating user');
      }
    });
  });

  describe('find user', () => {
    it('should find user', async () => {
      const result = await userService.findUser(userMock.email);
      expect(result).toBe(userMock);
    });

    it('should handle exception when finding user', async () => {
      try {
        await userService.findUser('dummy@email.com');
      } catch (error: any) {
        expect(error.message).toBe('Error finding user');
      }
    });
  });

  describe('get favorites', () => {
    it('should return favorite list succesfully', async () => {
      const result = await userService.getFavorites('1', {});
      expect(result).toBe(favoriteMock);
    });

    it('should handle exception returning favorite list', async () => {
      try {
        await userService.getFavorites('', {});
      } catch (error: any) {
        expect(error.message).toBe('Error returning favorites');
      }
    });
  });

  describe('get profile', () => {
    it('should get profile succesfully', async () => {
      const result = await userService.getProfile(userMock.id);
      expect(result).toBe(userMock);
    });

    it('should handle exception getting profile', async () => {
      try {
        await userService.getProfile('');
      } catch (error: any) {
        expect(error.message).toBe('Error returning user profile');
      }
    });
  });

  describe('get history', () => {
    it('should get history successfully', async () => {
      const result = await userService.getHistory('1', {});
      expect(result).toBe(historyMock);
    });

    it('should handle exception getting history', async () => {
      try {
        await userService.getHistory('', {});
      } catch (error: any) {
        expect(error.message).toBe('Failed to retrieve history');
      }
    });
  });
});
