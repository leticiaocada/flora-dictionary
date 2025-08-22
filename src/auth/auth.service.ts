/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly user: UserService) {}

  async createUser(createUser: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUser.password, salt);
    const user = {
      username: createUser.username,
      password: hash,
    };
    const userResult = await this.user.createUser(user);

    if (!userResult) {
      console.log('tratar erro');
    }
  }
}
