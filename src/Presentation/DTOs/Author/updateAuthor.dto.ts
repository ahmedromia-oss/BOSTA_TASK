import { Expose } from "class-transformer";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateAuthorDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Expose()
  name?: string;
}