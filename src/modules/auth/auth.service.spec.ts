import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { sign } from 'jsonwebtoken';

const userMock = {
  email: 'test@gmail.com',
  name: 'test',
  password: '123',
};

const signInUserMock = {
  name: 'test',
  id: '1',
  email: 'test@gmail.com',
  password: '$2b$10$/Bp43cwV.yhUvpwAY8LVAuMjWJAgeIrLrDlFOvoQCKgNNtFqX10Sm',
};

jest.mock('jsonwebtoken');

describe('auth service', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('dGVzdAo='),
          },
        },
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockImplementation((value) => {
              if (value?.name) {
                return userMock;
              }
            }),
            findUser: jest.fn().mockImplementation((value) => {
              if (value) {
                return signInUserMock;
              }
            }),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  describe('sign in and sing up', () => {
    it('should create user', async () => {
      (sign as jest.Mock).mockReturnValue('testtoken');
      const result = await authService.createUser(userMock);
      expect(result).toStrictEqual({
        id: signInUserMock.id,
        name: signInUserMock.name,
        token: 'testtoken',
      });
    });

    it('should sign in', async () => {
      (sign as jest.Mock).mockReturnValue('testtoken');
      const result = await authService.signIn({
        email: userMock.email,
        password: userMock.password,
      });
      expect(result).toStrictEqual({
        id: signInUserMock.id,
        name: signInUserMock.name,
        token: 'testtoken',
      });
    });

    it('should handle exception finding user', async () => {
      try {
        await authService.signIn({} as any);
      } catch (error) {
        expect(error.message).toBe('Invalid information');
      }
    });

    it('should handle exception when password does not match', async () => {
      try {
        await authService.signIn(signInUserMock);
      } catch (error) {
        expect(error.message).toBe('Invalid information');
      }
    });
  });
});
