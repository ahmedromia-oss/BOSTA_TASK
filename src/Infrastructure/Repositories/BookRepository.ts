
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
  async searchBooks(searchTerm: string): Promise<Book[]> {
    return await this.repository
    .createQueryBuilder('book')
    .leftJoinAndSelect('book.author', 'author')
    .where(
      'LOWER(book.title) LIKE LOWER(:searchTerm) OR ' +
      'LOWER(author.name) LIKE LOWER(:searchTerm) OR ' +
      'book.ISBN = :exactTerm',
      { 
        searchTerm: `%${searchTerm}%`,
        exactTerm: searchTerm 
      }
    )
    .getMany();
  }

}