import { GetBookDto } from "../../Presentation/DTOs/Book/getBook.dto.js";
import type { Book } from "../Models/Book.model.js";
import { BookBorrower } from "../Models/BorrowerBook.model.js";
import type { IBaseService } from "./IBaseService.js";

export interface IBookBorrowerService extends IBaseService<BookBorrower> {
      /**
       * Borrow a book for a given user
       * - Checks availability
       * - Sets due date
       */
      borrowBook(BookId:number , userId:number): Promise<string>;
    
      /**
       * Return a borrowed book
       * - Marks status as RETURNED
       * - Sets return date
       */
      returnBook(BookId:number , userId:number): Promise<string>;
    
      /**
       * Get all books currently borrowed by a user
       */
      getBorrowedBooks(userId:number ,skip?:number , take?:number): Promise<BookBorrower[]>;
    
      /**
       * Get all overdue books for a user or globally
       */
      getOverdueBooks(userId:number , skip?:number , take?:number): Promise<BookBorrower[]>;

      AllgetBorrowedBooks(skip?:number , take?:number): Promise<BookBorrower[]>;
    
      /**
       * Get all overdue books for a user or globally
       */
      AllgetOverdueBooks(skip?:number , take?:number): Promise<BookBorrower[]>;
}