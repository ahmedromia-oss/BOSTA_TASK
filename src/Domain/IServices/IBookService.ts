import type { Book } from "../Models/Book.model.js";
import type { User } from "../Models/user.model.js";
import type { IBaseService } from "./IBaseService.js";

export interface IBookService extends IBaseService<Book> {
    searchBooks(searchTerm:string):Promise<Book[]>
}