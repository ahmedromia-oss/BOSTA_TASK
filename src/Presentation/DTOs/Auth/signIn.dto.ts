import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ValidationErrors } from "../../../Domain/constants.js";
import { Expose } from "class-transformer";

export class RegisterDto {
  @IsEmail({}, { message: ValidationErrors.MUST_EMAIL })
  @IsNotEmpty({ message: ValidationErrors.REQUIRED })
  @MaxLength(50, { message: ValidationErrors.STRING_OUT_OF_RANGE })
  @Expose()
  email: string;

  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z])\S+$/, {
    message: "1UP_1LOWER_1SPECIAL_2NUM",
  })
  @MinLength(8, { message: ValidationErrors.MUST_8_CHRACHTERS })
  @Expose()
  password: string;

  @IsNotEmpty()
  @IsNotEmpty({ message: ValidationErrors.REQUIRED })
  @MaxLength(50, { message: ValidationErrors.STRING_OUT_OF_RANGE })
  @Expose()
  username: string;
}
