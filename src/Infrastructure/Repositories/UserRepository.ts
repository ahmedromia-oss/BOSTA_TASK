
import { Repository } from 'typeorm';
import { BaseRepository } from './BaseRepository.js';
import { User } from '../../Domain/Models/user.model.js';
import type { IUserRepository } from '../../Domain/IRepositories/IUserRepository.js';

export class UserRepository extends BaseRepository<User> implements IUserRepository{
  constructor(
    repository: Repository<User>,
  ) {
    super(repository);
  }
}