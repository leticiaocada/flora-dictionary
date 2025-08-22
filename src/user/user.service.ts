import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('User')
    private userRepository: Repository<User>,
  ) {}

  async createUser(user) {
    const insertUser = this.userRepository.create(user);
    return this.userRepository.save(insertUser);
  }
}
