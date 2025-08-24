import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from './auth.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { UserService } from '../user/user.service';
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
    const salt = await genSalt();
    const hashedPassword = await hash(createUser.password, salt);
    const user = {
      email: createUser.email,
      name: createUser.name,
      password: hashedPassword,
    };
    const userResult = await this.user.createUser(user);

    if (!userResult) {
      throw new BadRequestException('Error creating user');
    }

    return this.signIn({
      email: createUser.email,
      password: createUser.password,
    });
  }

  async signIn(signInUser: SignInUserDto) {
    const user = await this.user.findUser(signInUser.email);
    if (!user) {
      throw new BadRequestException('Invalid information');
    }
    const result = await compare(signInUser.password, user.password);
    if (!result) {
      throw new BadRequestException('Invalid information');
    }

    const token = sign({ id: user.id, email: user.email }, this.b64_priv_key, {
      algorithm: 'RS256',
      expiresIn: '1h',
    });
    return { id: user.id, name: user.name, token };
  }
}
