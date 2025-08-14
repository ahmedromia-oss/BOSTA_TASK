import { Expose } from "class-transformer";
import { IsString, IsOptional, IsISBN, IsNumber, Min } from "class-validator";

export class UpdateBookDto {
  
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Expose()
  availableQuantity?: number;
}