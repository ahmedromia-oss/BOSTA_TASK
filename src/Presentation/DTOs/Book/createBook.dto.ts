import { Expose } from "class-transformer";
import { IsISBN, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateBookDto {
  @IsString()
  @Expose()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Expose()
  ISBN: string;

  @IsNotEmpty()
  @Expose()
  authorId:number

  @IsNumber()
  @Min(0)
  @Expose()
  availableQuantity: number;
}