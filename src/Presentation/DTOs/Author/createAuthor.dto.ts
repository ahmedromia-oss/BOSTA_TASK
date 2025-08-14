import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Expose()
  name: string;
}