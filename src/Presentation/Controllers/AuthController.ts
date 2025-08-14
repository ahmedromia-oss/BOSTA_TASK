import type { Request, Response } from "express";
import type { IAuthController } from "../../Domain/IControllers/IAuthController.js";
import { AuthResponseDto } from "../DTOs/Auth/AuthResponse.dto.js";
import { RegisterDto } from "../DTOs/Auth/signIn.dto.js";
import { GetUserDto } from "../DTOs/User/getUser.dto.js";
import type { IAuthService } from "../../Domain/IServices/IAuthService.js";
import { LoginDto } from "../DTOs/Auth/Login.dto.js";
import { plainToInstance } from "class-transformer";
import { User } from "../../Domain/Models/user.model.js";
import { validate } from "class-validator";
import { BadRequestException } from "../../Application/Errors/BadRequestException.js";
import { serialize } from "../../Application/Decorators/Serialize.Decorator.js";

export class AuthController implements IAuthController {
  constructor(private readonly authService: IAuthService) {}
  @serialize(AuthResponseDto)
  async login(
    { body }: { body: LoginDto },
    res: Response
  ): Promise<AuthResponseDto> {
    const loginDto = plainToInstance(LoginDto, body);
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return await this.authService.login(loginDto);
  }
  @serialize(GetUserDto)
  async register(
    { body }: { body: RegisterDto },
    res: Response
  ): Promise<User> {
    const registerDto = plainToInstance(RegisterDto, body);
    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return await this.authService.register(registerDto);
  }
}
