import { IsISBN, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  ISBN: string;

  @IsNotEmpty()
  authorId:number

  @IsNumber()
  @Min(0)
  availableQuantity: number;
}