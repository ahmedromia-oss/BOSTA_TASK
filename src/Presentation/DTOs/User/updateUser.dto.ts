import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class updateUserDto {
  @IsOptional()
  @IsString()
  username: string;
}
