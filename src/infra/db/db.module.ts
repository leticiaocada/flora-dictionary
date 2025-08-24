import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'src/modules/dictionary/dictionary.entity';
import { User } from 'src/modules/user/user.entity';
import { Favorite } from 'src/modules/favorite/favorite.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { History } from 'src/modules/history/history.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('dbHost'),
          port: 5432,
          username: configService.get('dbUser'),
          password: configService.get('dbPass'),
          database: configService.get('dbName'),
          entities: [User, Dictionary, Favorite, History],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DbModule {}
