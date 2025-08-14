import { Expose, Type } from "class-transformer";
import { BorrowStatus } from "../../../Domain/constants.js";
import { GetUserDto } from "../User/getUser.dto.js";
import { GetBookDto } from "../Book/getBook.dto.js";

export class getBorrowedBooksDto {
 
  @Expose()
  status: BorrowStatus;
  @Expose()
  borrowDate: Date;
  @Expose()
  dueDate: Date;
  @Expose()
  @Type(()=>GetUserDto)
  user:GetUserDto
  @Expose()
  @Type(()=>GetBookDto)
  book:GetBookDto
}
