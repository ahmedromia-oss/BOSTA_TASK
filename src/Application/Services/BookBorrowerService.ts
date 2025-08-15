import { EntityManager, MoreThan } from "typeorm";
import { BorrowStatus } from "../../Domain/constants.js";
import type { IBookRepository } from "../../Domain/IRepositories/IBookRepository.js";
import { IBorrowerBookRepository } from "../../Domain/IRepositories/IBorrowerBookRepository.js";
import type { IBookService } from "../../Domain/IServices/IBookService.js";
import { IBookBorrowerService } from "../../Domain/IServices/IBorrowerBookService.js";
import { IUnitOfWork } from "../../Domain/IServices/IUnitOfWorkService.js";
import { Book } from "../../Domain/Models/Book.model.js";
import { BookBorrower } from "../../Domain/Models/BorrowerBook.model.js";
import { GetBookDto } from "../../Presentation/DTOs/Book/getBook.dto.js";
import { NotFoundException } from "../Errors/NotFoundException.js";
import { BaseService } from "./BaseService.js";
import { BadRequestException } from "../Errors/BadRequestException.js";

/**
 * Service managing book borrowing and returning operations
 * Handles inventory tracking and due date management
 */
export class BookBorrowerService
  extends BaseService<BookBorrower>
  implements IBookBorrowerService
{
  constructor(
    private readonly bookBorrowerRepository: IBorrowerBookRepository,
    private readonly bookService: IBookService,
    private readonly uow: IUnitOfWork
  ) {
    super(bookBorrowerRepository);
  }

  /**
   * Get all borrowed books across all users
   */
  async AllgetBorrowedBooks(skip?:number , take?:number): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getBorrowedBooks(skip , take);
  }

  /**
   * Get all overdue books across all users
   */
  async AllgetOverdueBooks(skip?:number , take?:number): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getOverDuedBooks(skip , take);
  }

  /**
   * Calculate due date for borrowed books (default 7 days from now)
   * @param daysToAdd Number of days to add to current date
   * @returns Due date set to end of day (23:59)
   */
  private calculateDueDate(daysToAdd: number = 7): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    dueDate.setHours(23, 59, 0, 0);
    return dueDate;
  }

  /**
   * Process book borrowing request with inventory management
   * Uses pessimistic locking to prevent race conditions
   */
  async borrowBook(BookId: number, userId: number): Promise<string> {
    try {
      // Check if user has already borrowed this book
      const Borrower = await this.bookBorrowerRepository.findOne({
        where: { bookId: BookId, userId: userId },
        relations: { book: true },
        order: { createdAt: "desc" },
      });

      if (Borrower?.status == BorrowStatus.RETURNED) {
        // User previously returned this book, allow new borrowing
        return await this.uow.execute(async (manager: EntityManager) => {
          // Lock the book record to prevent concurrent modifications
          const lockedBook = await manager
            .createQueryBuilder(Book, 'book')
            .where('book.id = :id', { id: BookId })
            .setLock('pessimistic_write')
            .getOne();

          if (!lockedBook || lockedBook.availableQuantity <= 0) {
            throw new BadRequestException({ message: "out of stock" });
          }

          // Decrease available quantity
          await this.bookService.update(
            { id: BookId, availableQuantity: MoreThan(0) },
            { availableQuantity: Borrower.book.availableQuantity - 1 },
            manager
          );

          // Create new borrow record
          await this.bookBorrowerRepository.create(
            {
              bookId: BookId,
              userId: userId,
              dueDate: this.calculateDueDate(),
            },
            manager
          );

          return "Borrowed";
        });
      } else {
        return "already Borrowed with no return";
      }
    } catch (e) {
      // Handle case where user never borrowed this book before
      if (e?.constructor?.name == "NotFoundException") {
        return await this.uow.execute(async (manager: EntityManager) => {
          // Lock the book record to ensure atomic operations
          const lockedBook = await manager
            .createQueryBuilder(Book, 'book')
            .where('book.id = :id', { id: BookId })
            .setLock('pessimistic_write')
            .getOne();

          if (!lockedBook || lockedBook.availableQuantity <= 0) {
            throw new BadRequestException({ message: "out of stock" });
          }

          const book = await this.bookService.findById(BookId);

          // Create borrow record
          await this.bookBorrowerRepository.create(
            {
              bookId: BookId,
              userId: userId,
              dueDate: this.calculateDueDate(),
            },
            manager
          );

          // Update book inventory
          await this.bookService.update(
            { id: BookId, availableQuantity: MoreThan(0) },
            { availableQuantity: book!.availableQuantity - 1 },
            manager
          );

          return "Borrowed";
        });
      } else {
        throw e;
      }
    }
  }

  /**
   * Process book return with inventory restoration
   * Handles both borrowed and overdue books
   */
  async returnBook(BookId: number, userId: number): Promise<string> {
    try {
      // Find the most recent borrow record for this book and user
      const Borrower = await this.bookBorrowerRepository.findOne({
        where: { bookId: BookId, userId: userId },
        order: { createdAt: "desc" },
        relations: { book: true },
      });

      if (
        Borrower?.status == BorrowStatus.BORROWED ||
        Borrower?.status == BorrowStatus.OVERDUE
      ) {
        return await this.uow.execute(async (manager: EntityManager) => {
          // Lock book record for inventory update
          const lockedBook = await manager
            .createQueryBuilder(Book, 'book')
            .where('book.id = :id', { id: BookId })
            .setLock('pessimistic_write')
            .getOne();

          if (!lockedBook) {
            throw new NotFoundException("Book not found");
          }

          // Create return record with original borrow details
          await this.bookBorrowerRepository.create(
            {
              bookId: BookId,
              userId: userId,
              status: BorrowStatus.RETURNED,
              returnDate: new Date(),
              dueDate: Borrower.dueDate,
              borrowDate: Borrower.borrowDate,
            },
            manager
          );

          // Restore book to available inventory
          await this.bookService.update(
            { id: BookId },
            { availableQuantity: lockedBook.availableQuantity + 1 },
            manager
          );

          return "returned";
        });
      } else {
        return "Not Borrowed";
      }
    } catch {
      return "Not Borrowed";
    }
  }

  /**
   * Get borrowed books for a specific user with pagination
   */
  async getBorrowedBooks(userId: number, skip?: number, take?: number): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getBorrowedBooksByUser(userId, skip, take);
  }

  /**
   * Get overdue books for a specific user with pagination
   * Defaults to first 5 records if pagination not specified
   */
  async getOverdueBooks(userId: number, skip?: number, take?: number): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getOverDuedBookByUser(userId, skip ?? 0, take ?? 5);
  }
}