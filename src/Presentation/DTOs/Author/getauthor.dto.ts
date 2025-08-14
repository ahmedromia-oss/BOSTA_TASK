import { Expose, Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { GetBookDto } from "../Book/getBook.dto.js";

export class getAuthorDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @Type(()=>GetBookDto)
  books:GetBookDto[]

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
