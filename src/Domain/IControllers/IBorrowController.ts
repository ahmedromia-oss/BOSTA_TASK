import { Request, Response } from "express";
import { Book } from "../Models/Book.model.js";
import { BookBorrower } from "../Models/BorrowerBook.model.js";

export interface IBorrowController {
  /**
   * Borrow a book for a given user
   * - Checks availability
   * - Sets due date
   */
  borrowBook(req: Request, res: Response): Promise<string>;

  /**
   * Return a borrowed book
   * - Marks status as RETURNED
   * - Sets return date
   */
  returnBook(req: Request, res: Response): Promise<string>;

  /**
   * Get all books currently borrowed by a user
   */
  getBorrowedBooks(req: Request, res: Response): Promise<BookBorrower[]>;

  /**
   * Get all overdue books for a user or globally
   */
  getOverdueBooks(req: Request, res: Response): Promise<BookBorrower[]>;
  AllgetOverdueBooks(req: Request, res: Response): Promise<BookBorrower[]>;
  AllgetBorrowedBooks(req: Request, res: Response): Promise<BookBorrower[]>;


}
