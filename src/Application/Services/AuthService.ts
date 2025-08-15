import { plainToInstance } from "class-transformer";
import type { IAuthService } from "../../Domain/IServices/IAuthService.js";
import type { AuthResponseDto } from "../../Presentation/DTOs/Auth/AuthResponse.dto.js";
import type { RegisterDto } from "../../Presentation/DTOs/Auth/signIn.dto.js";
import type { GetUserDto } from "../../Presentation/DTOs/User/getUser.dto.js";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import type { UserToken } from "../../Domain/Models/userToken.model.js";
import type { LoginDto } from "../../Presentation/DTOs/Auth/Login.dto.js";
import { Code } from "../../Domain/constants.js";
import { User } from "../../Domain/Models/user.model.js";
import { JwtService } from "@nestjs/jwt";
import type { IUserService } from "../../Domain/IServices/IUserService.js";
import { UnAuthorizedException } from "../Errors/UnAuthorizedException.js";
import { BadRequestException } from "../Errors/BadRequestException.js";
import { config } from 'dotenv';
/**
 * Service handling user authentication operations
 * Manages login, registration, and password hashing
 */
config()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: IUserService,
    private readonly jwtService: JwtService
  ) {}

  async login(login: LoginDto): Promise<AuthResponseDto> {
    // Find user by email address
    const user = await this.userService.findOne({
      where: { email: login.email },
    });

    if (user) {
      // Verify password using stored salt and hash
      const scrypt = promisify(_scrypt);
      const [salt, Storedhash] = user.password.split(".");
      const hash = (await scrypt(login.password, salt!, 32)) as Buffer;
      
      if (Storedhash != hash.toString("hex")) {
        throw new BadRequestException({message:"Wrong credintials"});
      }
      
      // Create JWT payload with user info
      const payload: UserToken = {
        sub: user.id,
        userType: user.userType
      };

      // Generate access token
      const token = await this.jwtService.signAsync(payload, {
        secret:process.env.SECRET_KEY||"mySecretKey",
        expiresIn: "1h",
      });
      
      return { token: token };
    }
    
    throw new UnAuthorizedException("Wrong credintials");
  }

  async register(signInDto: RegisterDto): Promise<User> {
    // Check if email is already taken
    if (
      (await this.userService.checkIFExists({
        where: { email: signInDto.email },
      }))
    ) {
      throw new BadRequestException({message:Code.EMAIL_USED});
    }

    console.log(signInDto)
    const hashedPass = await this.hashSaltPassword(signInDto.password);
    signInDto.password = hashedPass;
    
    // Convert DTO to User entity and save
    
    return await this.userService.create(signInDto);
  }

  verifyToken(token: string): Promise<boolean> {
    // TODO: Implement token verification logic
    throw new Error("Method not implemented.");
  }

  /**
   * Hash password with random salt using scrypt
   * @param password Plain text password to hash
   * @returns Salted hash in format "salt.hash"
   */
  private async hashSaltPassword(password: string): Promise<string> {
    const scrypt = promisify(_scrypt);
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + "." + hash.toString("hex");
    return result;
  }
}