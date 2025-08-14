import { Author } from "../Models/Author.model.js";
import type { Book } from "../Models/Book.model.js";
import type { User } from "../Models/user.model.js";
import type { IBaseService } from "./IBaseService.js";

export interface IAuthorService extends IBaseService<Author> {
}