import { Author } from "../Models/Author.model.js";
import { Book } from "../Models/Book.model.js";
import { Request , Response } from "express";
export interface IAuthorController {
  create(req: Request, res: Response): Promise<Author>;
  getById(req: Request, res: Response): Promise<Author| null>;
  getAll(req: Request, res: Response): Promise<Author[]>;
  update(req: Request, res: Response): Promise<string>;
  delete(req: Request, res: Response): Promise<string>;
}