import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class updateUserDto {
  @IsOptional()
  @IsString()
  @Expose()
  username: string;
}
