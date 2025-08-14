import  {Request,  Response } from "express";
import type { AuthResponseDto } from "../../Presentation/DTOs/Auth/AuthResponse.dto.js";
import type { RegisterDto } from "../../Presentation/DTOs/Auth/signIn.dto.js";
import type { GetUserDto } from "../../Presentation/DTOs/User/getUser.dto.js";
import { LoginDto } from "../../Presentation/DTOs/Auth/Login.dto.js";
import { User } from "../Models/user.model.js";

export interface IAuthController {
  login(req:Request , res:Response): Promise<AuthResponseDto>;
  register(req:Request , res:Response): Promise<User>;
}