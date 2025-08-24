import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  decodedPublicKey: string;

  constructor(private readonly config: ConfigService) {
    const public_key: string = this.config.get('publicKey')!;
    this.decodedPublicKey = Buffer.from(public_key, 'base64').toString('utf-8');
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return this.validadeToken(request);
  }

  validadeToken(request: Request) {
    try {
      const headerAuthorization: string = request.headers['authorization'];
      if (!headerAuthorization) {
        throw new BadRequestException('Error authenticating');
      }
      const token = headerAuthorization.split(' ')[1];
      verify(token, this.decodedPublicKey);
      return true;
    } catch {
      throw new BadRequestException('Error authenticating');
    }
  }
}
