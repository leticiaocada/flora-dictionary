/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, signInUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/user.service';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private b64_priv_key: Buffer<ArrayBuffer>;

  constructor(
    private readonly user: UserService,
    private readonly config: ConfigService,
  ) {
    const private_key: string = this.config.get('privateKey')!;
    this.b64_priv_key = Buffer.from(private_key, 'base64');
  }

  async createUser(createUser: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUser.password, salt);
    const user = {
      username: createUser.username,
      password: hash,
    };
    const userResult = await this.user.createUser(user);

    if (!userResult) {
      throw new BadRequestException('Error creating user');
    }
  }

  async signIn(signInUser: signInUserDto) {
    const user = await this.user.findUser(signInUser.username);
    if (!user) {
      throw new BadRequestException('Invalid information');
    }
    const result = await bcrypt.compare(signInUser.password, user.password);
    if (!result) {
      throw new BadRequestException('Invalid information');
    }
    const token = sign(
      { id: user.id, username: user.username },
      this.b64_priv_key,
      {
        algorithm: 'RS256',
      },
    );
    return { token };
  }
}
