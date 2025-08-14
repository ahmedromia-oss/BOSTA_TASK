import { Expose, Type } from "class-transformer";
import { BorrowStatus } from "../../../Domain/constants.js";

export class getBorrowedBooksDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  ISBN: string;

  @Expose()
  availableQuantity: number;

  @Expose()
  status: BorrowStatus;
  @Expose()
  borrowDate: Date;
  @Expose()
  dueDate: Date;
  @Expose()
  username: string;
  @Expose()
  email: string;
}
