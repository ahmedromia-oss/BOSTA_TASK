import { Exclude, Expose, Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ValidationErrors } from "../../../Domain/constants.js";

export class LoginDto {
  @IsNotEmpty({ message: ValidationErrors.REQUIRED })
  @Transform(({ value }) => value?.toLowerCase())
  @Expose()
  email: string;
  @IsNotEmpty({ message: ValidationErrors.REQUIRED })
  @Expose()
  password: string;
}
