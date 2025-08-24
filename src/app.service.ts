import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMessage() {
    return { message: 'English Dictionary' };
  }

  healthCheck() {
    return { message: 'ok' };
  }
}
