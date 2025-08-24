import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { AuthenticationGuard } from './authentication.guard';
import { BadRequestException } from '@nestjs/common';

jest.mock('jsonwebtoken');

describe('auth service', () => {
  let authGuard: AuthenticationGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticationGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('dGVzdAo='),
          },
        },
      ],
    }).compile();

    authGuard = moduleRef.get(AuthenticationGuard);
  });

  describe('auth guard', () => {
    it('should validate token', () => {
      (verify as jest.Mock).mockImplementation((value) => {
        if (value === 'testtoken') {
          return true;
        }

        throw new BadRequestException('Error authenticating');
      });
      authGuard.validadeToken({
        headers: {
          authorization: 'Bearer testtoken',
        },
      } as any);
    });

    it('should handle exception if token not present', () => {
      try {
        authGuard.validadeToken({
          headers: {},
        } as any);
      } catch (error) {
        expect(error.message).toBe('Error authenticating');
      }
    });

    it('should validate token', () => {
      (verify as jest.Mock).mockImplementation((value) => {
        if (value === 'testtoken') {
          return true;
        }

        throw new BadRequestException('Error authenticating');
      });

      try {
        authGuard.validadeToken({
          headers: {
            authorization: 'Bearer invalidToken',
          },
        } as any);
      } catch (error) {
        expect(error.message).toBe('Error authenticating');
      }
    });
  });
});
