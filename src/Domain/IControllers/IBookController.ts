import { Book } from "../Models/Book.model.js";
import { Request, Response } from "express";
export interface IBookController {
  create(req: Request, res: Response): Promise<Book>;
  getById(req: Request, res: Response): Promise<Book | null>;
  getAll(req: Request, res: Response): Promise<Book[]>;
  update(req: Request, res: Response): Promise<string>;
  delete(req: Request, res: Response): Promise<string>;
  searchBooks(req: Request, res: Response): Promise<Book[]>;
}
