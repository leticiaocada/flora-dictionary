import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteService } from '../favorite/favorite.service';
import { CreateUserDto } from '../auth/auth.dto';
import { HistoryService } from '../history/history.service';
import { PaginationDTO } from '../dictionary/dictionary.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly favorite: FavoriteService,
    private readonly history: HistoryService,
  ) {}

  async createUser(user: CreateUserDto) {
    try {
      const userEntity = this.userRepository.create(user);
      return this.userRepository.save<User>(userEntity);
    } catch {
      throw new BadRequestException('Error creating user');
    }
  }

  async findUser(email: string) {
    try {
      return this.userRepository.findOne({ where: { email } });
    } catch {
      throw new BadRequestException('Error finding user');
    }
  }

  async getFavorites(id: string, params: PaginationDTO) {
    try {
      return await this.favorite.getFavoritesByUserId(id, params);
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

  async getHistory(id: string, params: PaginationDTO) {
    try {
      return await this.history.getHistory(id, params);
    } catch {
      throw new BadRequestException('Failed to retrieve history');
    }
  }
}
