import { Request, Response } from "express";
import { IBorrowController } from "../../Domain/IControllers/IBorrowController.js";
import { BookBorrowerService } from "../../Application/Services/BookBorrowerService.js";
import { IBookBorrowerService } from "../../Domain/IServices/IBorrowerBookService.js";
import { Book } from "../../Domain/Models/Book.model.js";
import { Auth } from "../../Application/Decorators/authGaurd.decorator.js";
import { serialize } from "../../Application/Decorators/Serialize.Decorator.js";
import { GetBookDto } from "../DTOs/Book/getBook.dto.js";
import { getBorrowedBooksDto } from "../DTOs/Borrows/BorrowedBooks.dto.js";
import { BookBorrower } from "../../Domain/Models/BorrowerBook.model.js";

/**
 * Controller managing book borrowing and returning operations
 * Handles both admin queries and user-specific borrowing actions
 */
export class BorrowController implements IBorrowController {
    constructor(private readonly borrowService: IBookBorrowerService) {}

    /**
     * Get all overdue books across all users (Admin view)
     * Returns paginated list of overdue borrowing records
     */
    @serialize(getBorrowedBooksDto)
    async AllgetOverdueBooks(req: Request, res: Response): Promise<BookBorrower[]> {
        const { skip, take } = req.query
        return await this.borrowService.AllgetOverdueBooks(Number(skip), Number(take))
    }

    /**
     * Get all borrowed books across all users (Admin view)
     * Returns paginated list of active borrowing records
     */
    @serialize(getBorrowedBooksDto)
    async AllgetBorrowedBooks(req: Request, res: Response): Promise<BookBorrower[]> {
        const { skip, take } = req.query
        return await this.borrowService.AllgetBorrowedBooks(Number(skip), Number(take))
    }

    /**
     * Borrow a book (Authenticated users only)
     * Creates a new borrowing record and updates inventory
     */
    @Auth()
    @serialize()
    async borrowBook({ user, ...req }: Request, res: Response): Promise<string> {
        const { bookId } = req.params
        
        // Use authenticated user's ID from JWT token
        return await this.borrowService.borrowBook(Number(bookId), Number(user?.sub))
    }

    /**
     * Return a borrowed book (Authenticated users only)  
     * Updates borrowing record and restores inventory
     */
    @Auth()
    @serialize()
    async returnBook({ user, ...req }: Request, res: Response): Promise<string> {
        const { bookId } = req.params

        // Use authenticated user's ID, fallback to 0 if not available
        return await this.borrowService.returnBook(Number(bookId), user?.sub ?? 0)
    }

    /**
     * Get current user's borrowed books
     * Returns paginated list of user's active borrows
     */
    @Auth()
    @serialize(getBorrowedBooksDto)
    async getBorrowedBooks({ user, ...req }: Request, res: Response): Promise<BookBorrower[]> {
        const { skip, take } = req.query
        return await this.borrowService.getBorrowedBooks(user?.sub ?? 0, Number(skip), Number(take))
    }

    /**
     * Get current user's overdue books
     * Returns paginated list of user's overdue borrows
     */
    @Auth()
    @serialize(getBorrowedBooksDto)
    async getOverdueBooks({ user, ...req }: Request, res: Response): Promise<BookBorrower[]> {
        const { skip, take } = req.query
        return await this.borrowService.getOverdueBooks(user?.sub ?? 0, Number(skip), Number(take))
    }
}