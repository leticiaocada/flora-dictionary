import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './infra/common/common.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, DictionaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
