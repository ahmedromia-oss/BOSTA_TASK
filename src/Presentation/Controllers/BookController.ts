import { type Response, type Request } from "express";
import type { IBookController } from "../../Domain/IControllers/IBookController.js";
import type { IBookService } from "../../Domain/IServices/IBookService.js";
import { serialize } from "../../Application/Decorators/Serialize.Decorator.js";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BadRequestException } from "../../Application/Errors/BadRequestException.js";
import { GetBookDto } from "../DTOs/Book/getBook.dto.js";
import { CreateBookDto } from "../DTOs/Book/createBook.dto.js";
import { Book } from "../../Domain/Models/Book.model.js";
import { UpdateBookDto } from "../DTOs/Book/updateBook.dto.js";
import { Auth } from "../../Application/Decorators/authGaurd.decorator.js";
import { UserType } from "../../Domain/constants.js";
import { AuthorService } from "../../Application/Services/AuthorService.js";
import { IAuthorService } from "../../Domain/IServices/IAuthorService.js";

export class BookController implements IBookController {
  constructor(
    private bookService: IBookService,
    private readonly authorService: IAuthorService
  ) {}
  @serialize(GetBookDto)
  async searchBooks(req: Request, res: Response): Promise<Book[]> {
    const searchTerm = req.query.search as string;
    return await this.bookService.searchBooks(searchTerm);
  }
  // @Auth(UserType.ADMIN)
  @serialize(GetBookDto)
  async create({ body }: Request, res: Response): Promise<Book> {
    const book = plainToInstance(CreateBookDto, body, {
      excludeExtraneousValues: true,
    });

    if (book.authorId) {
      await this.authorService.findOne({ where: { id: book.authorId } });
    }
    if (await this.bookService.checkIFExists({ where: { ISBN: book.ISBN } })) {
      throw new BadRequestException({ message: "ISBN already has been used" });
    }
    if (
      await this.bookService.checkIFExists({ where: { title: book.title } })
    ) {
      throw new BadRequestException({ message: "title already has been used" });
    }

    const errors = await validate(book);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.bookService.create(book);
  }

  @serialize(GetBookDto)
  async getById(req: Request, res: Response): Promise<Book | null> {
    const { id } = req.params;
    return await this.bookService.findById(Number(id));
  }

  @serialize(GetBookDto)
  async getAll(req: Request, res: Response): Promise<Book[]> {
    const {take , skip} = req.query
    return await this.bookService.findAll({take:Number(take??5),skip:Number(skip??0)});
  }

  @serialize()
  async update(req: Request, res: Response): Promise<string> {
    const { id } = req.params;
    const { body } = req;

    const updateData = plainToInstance(UpdateBookDto, body, {
      excludeExtraneousValues: true,
    });

    const errors = await validate(updateData);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.bookService.update({ id: Number(id) }, updateData);
  }
  @serialize()
  async delete(req: Request, res: Response): Promise<string> {
    const { id } = req.query;
    return await this.bookService.delete({ id: Number(id) });
  }
  
}
