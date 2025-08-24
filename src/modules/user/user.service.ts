import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteService } from '../favorite/favorite.service';
import { CreateUserDto } from '../auth/auth.dto';
import { HistoryService } from '../history/history.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly favorite: FavoriteService,
    private readonly history: HistoryService,
  ) {}

  async createUser(user: CreateUserDto) {
    const userEntity = this.userRepository.create(user);
    return this.userRepository.save<User>(userEntity);
  }

  async findUser(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async getFavorites(id: string) {
    try {
      return await this.favorite.getFavoritesByUserId(id);
    } catch {
      throw new BadRequestException('Error returning favorites');
    }
  }

  async getProfile(id: string) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch {
      throw new BadRequestException('Error returning user profile');
    }
  }

  async getHistory(id: string) {
    try {
      return this.history.getHistory(id);
    } catch {
      throw new BadRequestException('Failed to retrieve history');
    }
  }
}
