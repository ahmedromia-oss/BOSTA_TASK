import { Author } from "../Models/Author.model.js";
import { Book } from "../Models/Book.model.js";
import { BookBorrower } from "../Models/BorrowerBook.model.js";
import type { IBaseRepository } from "./IBaseRepository.js";

export interface IBorrowerBookRepository extends IBaseRepository<BookBorrower>{
    getBorrowedBooksByUser(userId:number):Promise<BookBorrower[]>
    getOverDuedBookByUser(userId:number):Promise<BookBorrower[]>
    getBorrowedBooks():Promise<BookBorrower[]>
    getOverDuedBooks():Promise<BookBorrower[]>
}