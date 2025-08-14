import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class createUserDto {
  @IsNotEmpty()
  @Expose()
  username: string;
  @IsNotEmpty()
  @Expose()
  email: string;
  @Expose()
  @IsNotEmpty()
  password: string;
}
