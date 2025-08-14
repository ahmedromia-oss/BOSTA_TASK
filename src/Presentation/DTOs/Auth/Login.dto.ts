import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ValidationErrors } from "../../../Domain/constants.js";

export class LoginDto {
  @IsNotEmpty({ message: ValidationErrors.REQUIRED })
  @Transform(({ value }) => value?.toLowerCase())
  email: string;
  @IsNotEmpty({ message: ValidationErrors.REQUIRED })
  password: string;
}
