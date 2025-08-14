import { IAuthorRepository } from "../../Domain/IRepositories/IAuthorRepository.js";
import { IAuthorService } from "../../Domain/IServices/IAuthorService.js";
import { IAuthService } from "../../Domain/IServices/IAuthService.js";
import { Author } from "../../Domain/Models/Author.model.js";
import { BaseService } from "./BaseService.js";

export class AuthorService extends BaseService<Author> implements IAuthorService {
    constructor(private readonly authorRepository:IAuthorRepository){
        super(authorRepository)
    }

}