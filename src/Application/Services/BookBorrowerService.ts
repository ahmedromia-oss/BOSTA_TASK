import { EntityManager } from "typeorm";
import { BorrowStatus } from "../../Domain/constants.js";
import type { IBookRepository } from "../../Domain/IRepositories/IBookRepository.js";
import { IBorrowerBookRepository } from "../../Domain/IRepositories/IBorrowerBookRepository.js";
import type { IBookService } from "../../Domain/IServices/IBookService.js";
import { IBookBorrowerService } from "../../Domain/IServices/IBorrowerBookService.js";
import { IUnitOfWork } from "../../Domain/IServices/IUnitOfWorkService.js";
import type { Book } from "../../Domain/Models/Book.model.js";
import { BookBorrower } from "../../Domain/Models/BorrowerBook.model.js";
import { GetBookDto } from "../../Presentation/DTOs/Book/getBook.dto.js";
import { NotFoundException } from "../Errors/NotFoundException.js";
import { BaseService } from "./BaseService.js";
import { BadRequestException } from "../Errors/BadRequestException.js";

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
  async AllgetBorrowedBooks(): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getBorrowedBooks();
  }
  async AllgetOverdueBooks(): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getOverDuedBooks();
  }
  private calculateDueDate(daysToAdd: number = 7): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    dueDate.setHours(23, 59, 0, 0); // 23:59:00.000
    return dueDate;
  }
  async borrowBook(BookId: number, userId: number): Promise<string> {
    try {
      const Borrower = await this.bookBorrowerRepository.findOne({
        where: { bookId: BookId, userId: userId },
        relations: { book: true },
        order: { createdAt: "desc" },
      });
      if (Borrower?.status == BorrowStatus.RETURNED) {
        return await this.uow.execute(async (manager: EntityManager) => {
          if(Borrower.book.availableQuantity < 1){
            throw new BadRequestException({message:"out of stock"})
          }
          await this.bookService.update(
            { id: BookId },
            { availableQuantity:Borrower.book.availableQuantity - 1},
            manager
          );
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
      if (e?.constructor?.name == "NotFoundException") {
        return await this.uow.execute(async (manager: EntityManager) => {

          const book = await this.bookService.findById(BookId);
          if(book?.availableQuantity!<1){
            throw new BadRequestException({message:"out of stock"})
          }

          await this.bookBorrowerRepository.create(
            {
              bookId: BookId,
              userId: userId,
              dueDate: this.calculateDueDate(),
            },
            manager
          );
          await this.bookService.update(
            { id: BookId },
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
  async returnBook(BookId: number, userId: number): Promise<string> {
    try {
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
          await this.bookService.update(
            { id: BookId },
            { availableQuantity: Borrower.book.availableQuantity + 1 },
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
  async getBorrowedBooks(userId: number): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getBorrowedBooksByUser(userId);
  }
  async getOverdueBooks(userId: number): Promise<BookBorrower[]> {
    return await this.bookBorrowerRepository.getOverDuedBookByUser(userId);
  }
}
