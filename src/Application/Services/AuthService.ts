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
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: IUserService,
    private readonly jwtService: JwtService
  ) {}
  async login(login: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findOne({
      where: { email: login.email },
    });

    if (user) {
      const scrypt = promisify(_scrypt);
      const [salt, Storedhash] = user.password.split(".");
      const hash = (await scrypt(login.password, salt!, 32)) as Buffer;
      if (Storedhash != hash.toString("hex")) {
        throw new BadRequestException({message:"Wrong credintials"});
      }
      const payload: UserToken = {
        sub: user.id,
        userType:user.userType
      };
      const token = await this.jwtService.signAsync(payload, {
        secret: "mySecretKey",
        expiresIn: "1h",
      });
      return { token: token };
    }
    throw new UnAuthorizedException("Wrong credintials");
  }
  async register(signInDto: RegisterDto): Promise<User> {
    if (
      (await this.userService.checkIFExists({
        where: { email: signInDto.email },
      }))
    ) {
   
      throw new BadRequestException({message:Code.EMAIL_USED});
    }

    const hashedPass = await this.hashSaltPassword(signInDto.password);
    signInDto.password = hashedPass;
    const user = plainToInstance(User, signInDto);

    return await this.userService.create(user);
  }

  verifyToken(token: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  private async hashSaltPassword(password: string): Promise<string> {
    const scrypt = promisify(_scrypt);
    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + "." + hash.toString("hex");
    return result;
  }
}
