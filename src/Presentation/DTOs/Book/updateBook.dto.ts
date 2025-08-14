import { IsString, IsOptional, IsISBN, IsNumber, Min } from "class-validator";

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsISBN()
  @IsOptional()
  ISBN?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  availableQuantity?: number;
}