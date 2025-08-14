import type { AuthResponseDto } from "../../Presentation/DTOs/Auth/AuthResponse.dto.js";
import type { LoginDto } from "../../Presentation/DTOs/Auth/Login.dto.js";
import type { RegisterDto } from "../../Presentation/DTOs/Auth/signIn.dto.js";
import type { GetUserDto } from "../../Presentation/DTOs/User/getUser.dto.js";
import { User } from "../Models/user.model.js";

export interface IAuthService {
  login(login: LoginDto): Promise<AuthResponseDto>;
  register(signInDto: RegisterDto): Promise<User>;

  verifyToken(token: string): Promise<boolean>;
}
