import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'src/modules/dictionary/dictionary.entity';
import { User } from 'src/modules/user/user.entity';
import { Favorite } from 'src/modules/favorite/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'dictionary',
      entities: [User, Dictionary, Favorite],
      synchronize: true,
    }),
  ],
})
export class DbModule {}
