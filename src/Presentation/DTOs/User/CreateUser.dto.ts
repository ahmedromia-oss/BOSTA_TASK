import { IsNotEmpty } from "class-validator";

export class createUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
