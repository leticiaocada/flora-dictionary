import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage() {
    return this.appService.getMessage();
  }

  @Get('healthz')
  healthCheck() {
    return this.appService.healthCheck();
  }
}
