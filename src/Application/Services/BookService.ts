import type { IBookRepository } from "../../Domain/IRepositories/IBookRepository.js";
import type { IBookService } from "../../Domain/IServices/IBookService.js";
import type { Book } from "../../Domain/Models/Book.model.js";
import { BaseService } from "./BaseService.js";

export class BookService extends BaseService<Book> implements IBookService {
    constructor(private readonly bookRepository:IBookRepository){
        super(bookRepository)
    }
    async searchBooks(searchTerm: string): Promise<Book[]> {
        return await this.bookRepository.searchBooks(searchTerm)
    }

}