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

export class BorrowController implements IBorrowController{
    constructor(private readonly borrowService:IBookBorrowerService){}
    @serialize(getBorrowedBooksDto)
    async AllgetOverdueBooks(req: Request, res: Response): Promise<BookBorrower[]> {
        return await this.borrowService.AllgetOverdueBooks()
    }
    @serialize(getBorrowedBooksDto)
    async AllgetBorrowedBooks(req: Request, res: Response): Promise<BookBorrower[]> {
        return await this.borrowService.AllgetBorrowedBooks()
    }
    @Auth()
    @serialize()
    async borrowBook({user , ...req}: Request, res: Response): Promise<string> {
       const {bookId} = req.params
       return await this.borrowService.borrowBook(Number(bookId) , Number(user?.sub))
    }
    @Auth()
    @serialize()
    async returnBook({user , ...req}: Request, res: Response): Promise<string> {
        const {bookId} = req.params


        return await this.borrowService.returnBook(Number(bookId) ,user?.sub??0)
    }
    @Auth()
    @serialize(getBorrowedBooksDto)
    async getBorrowedBooks({user}: Request, res: Response): Promise<BookBorrower[]> {
        return await this.borrowService.getBorrowedBooks(user?.sub??0)
    }
    @Auth()
    @serialize(getBorrowedBooksDto)
    async getOverdueBooks({user}: Request, res: Response): Promise<BookBorrower[]> {
        return await this.borrowService.getOverdueBooks(user?.sub??0)

    }
   
}