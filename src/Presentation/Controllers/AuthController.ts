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

/**
 * Controller handling authentication endpoints
 * Manages user login and registration with validation
 */
export class AuthController implements IAuthController {
  constructor(private readonly authService: IAuthService) {}

  /**
   * Handle user login request
   * Validates credentials and returns JWT token on success
   */
  @serialize(AuthResponseDto)
  async login(
    { body }: { body: LoginDto },
    res: Response
  ): Promise<AuthResponseDto> {
    // Transform request body to LoginDto instance
    const loginDto = plainToInstance(LoginDto, body);
    
    // Validate the login data against DTO constraints
    const errors = await validate(loginDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    
    // Process login through auth service
    return await this.authService.login(loginDto);
  }

  /**
   * Handle user registration request
   * Creates new user account after validation
   */
  @serialize(GetUserDto)
  async register(
    { body }: { body: RegisterDto },
    res: Response
  ): Promise<User> {
    // Transform request body to RegisterDto instance
    const registerDto = plainToInstance(RegisterDto, body);
    
    // Validate registration data
    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    
    // Create new user through auth service
    return await this.authService.register(registerDto);
  }
}