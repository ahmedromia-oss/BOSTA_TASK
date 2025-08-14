import { type Request, type Response } from "express";
import { User } from "../Models/user.model.js";

export interface IUserController {
  getUsers(req: Request, res: Response): Promise<User[]>;
  createUser(req:Request , res:Response):Promise<User>
}
