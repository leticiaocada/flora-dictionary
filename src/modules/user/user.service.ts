import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user) {
    const insertUser = this.userRepository.create(user);
    return this.userRepository.save(insertUser);
  }

  async findUser(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
}
