import type { Book } from "../Models/Book.model.js";
import { BookBorrower } from "../Models/BorrowerBook.model.js";
import type { IBaseRepository } from "./IBaseRepository.js";

export interface IBookRepository extends IBaseRepository<Book>{
  searchBooks(searchTerm:string , skip?:number , take?:number):Promise<Book[]>
}