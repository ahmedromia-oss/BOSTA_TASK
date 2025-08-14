import { Expose, Type } from "class-transformer";
import { getAuthorDto } from "../Author/getauthor.dto.js";

export class GetBookDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(()=>getAuthorDto)
  author:getAuthorDto

  @Expose()
  ISBN: string;

  @Expose()
  availableQuantity: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
