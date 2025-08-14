import type { Book } from "../Models/Book.model.js";
import type { User } from "../Models/user.model.js";
import type { IBaseRepository } from "./IBaseRepository.js";

export interface IUserRepository extends IBaseRepository<User>{

}