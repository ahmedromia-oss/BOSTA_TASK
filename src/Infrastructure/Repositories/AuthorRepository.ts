import {  Repository } from "typeorm";
import { IAuthorRepository } from "../../Domain/IRepositories/IAuthorRepository.js";
import { Author } from "../../Domain/Models/Author.model.js";
import { BaseRepository } from "./BaseRepository.js";

export class AuthorRepository extends BaseRepository<Author> implements IAuthorRepository{
  constructor(
    repository: Repository<Author>,
  ) {
    super(repository);
  }
}