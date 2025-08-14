
import { Repository } from 'typeorm';
import { Book } from '../../Domain/Models/Book.model.js';
import { BaseRepository } from './BaseRepository.js';
import type { IBookRepository } from '../../Domain/IRepositories/IBookRepository.js';

export class BookRepository extends BaseRepository<Book> implements IBookRepository{
  constructor(
    repository: Repository<Book>,
  ) {
    super(repository);
  }
}